import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormDisplayMode, Log } from '@microsoft/sp-core-library';
import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

import { DailyReportHomeOffice } from './components/DailyReportHomeOffice';
import { DailyReportHomeOfficeProps } from './components/DailyReportHomeOfficeProps';

import { Profile } from '../../interfaces/Profile';

import { SPHttpClient, HttpClientResponse } from '@microsoft/sp-http';  
import { JobItemDto, ResponseJobItem } from '../../interfaces/JobItem';
import { DailyReportDto } from '../../interfaces/DailyReport';

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDailyReportHomeOfficeFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'DailyReportHomeOfficeFormCustomizer';

export default class DailyReportHomeOfficeFormCustomizer
  extends BaseFormCustomizer<IDailyReportHomeOfficeFormCustomizerProperties> {

  hierarquiaListId = '1733062b-2634-43fc-8207-42fe20b40ac4'
  dailyReportListId = 'abe0a217-2715-4450-adc7-841cb33431d4'
  dailyReportItemsListId = 'c5f255aa-ed5d-418e-b2af-d7d48ddbf0fb'

  formData: DailyReportDto = {
    Id: null,
    EmployeeId: null,
    ManagerId: null,
    Status: 'Draft',
    JobDate: new Date(),
  }

  employeeProfile: Profile
  managerProfile: Profile

  isEmployee: boolean
  isManager: boolean

  jobItems: JobItemDto[] = []

  public async onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    const {email: currentUserEmail} = this.context.pageContext.user

    if(this.displayMode === FormDisplayMode.New) {
      this.employeeProfile = await this.getDataFromHierarquia({EMAIL_EMPLOYE: currentUserEmail})
      this.managerProfile = await this.getDataFromHierarquia({EMAIL_1ST_EVALUATOR: this.employeeProfile.EMAIL_1ST_EVALUATOR})

      this.formData.EmployeeId = this.employeeProfile.Id
      this.formData.ManagerId = this.managerProfile.Id

      this.isEmployee = true
      this.isManager = false
    }
    else {
      this.formData = await this.getItemsFromMainList(this.context.item.ID)
      this.jobItems = await this.getItemsFromSecondaryList(this.formData.Id)
      
      this.employeeProfile = await this.getDataFromHierarquia({Id: this.formData.EmployeeId})
      this.managerProfile = await this.getDataFromHierarquia({Id: this.formData.ManagerId})

      this.formData.EmployeeId = this.employeeProfile.Id
      this.formData.ManagerId = this.managerProfile.Id

      this.isEmployee = this.employeeProfile.EMAIL_EMPLOYE === currentUserEmail
      this.isManager = this.managerProfile.EMAIL_EMPLOYE === currentUserEmail           
    }

    Log.info(LOG_SOURCE, 'Activated DailyReportHomeOfficeFormCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    return Promise.resolve();
  }

  public render(): void {
    const dailyReportHomeOffice: React.ReactElement<DailyReportHomeOfficeProps> =
      React.createElement(DailyReportHomeOffice, {
        displayMode: this.displayMode,
        onSave: this.saveOnMainList.bind(this),
        onSaveSecondary: this.saveOnSecondaryList.bind(this),
        employee: this.employeeProfile,
        manager: this.managerProfile,
        date: this.formData.JobDate,
        isManager: this.isManager,
        isEmployee: this.isEmployee,
        formData: this.formData,
        items: this.jobItems,
       });

    ReactDOM.render(dailyReportHomeOffice, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  /* Método não será necessário, pois não teremos um botão de cancelar
  private _onClose =  (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }*/

  private async getDataFromHierarquia(data: Partial<Profile>): Promise<Profile> {
    let query = ''
    if(Object.keys(data).length === 1) {
      const key = Object.keys(data)[0]
      query = `${key} eq '${data[key]}'`
    }
    else {
      query = Object.keys(data).reduce((accumulator, key) => {
        return `${accumulator} ${key} eq '${data[key]}' and`
      }, '')
    }    

    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.hierarquiaListId}')/items?$filter=${query}`

    const getDataResponse = await this.getData(apiUrl)
    const responseJson = await getDataResponse.json()

    if(responseJson.value.length === 0) {
      throw Error('Não foi possível localizar registros')
    }

    return responseJson.value[0]
  }

  private getApiUrl(): string {
    return this.context.pageContext.web.absoluteUrl
  }

  private async getData(url: string): Promise<HttpClientResponse> {
    return await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
  }

  private async saveOnMainList(data: DailyReportDto, reload: boolean): Promise<DailyReportDto> {
    const {Id, Tag, ...dataToSave} = data
    let apiUrl = ''
    let method = ''

    if(Id) {
      apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items(${Id})`
      method = 'MERGE'
    }
    else {
      apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items`
      method = 'POST'
    }    

    const response = await this.context.spHttpClient.fetch(apiUrl, SPHttpClient.configurations.v1,       {
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "odata-version": "",
        "IF-MATCH": Tag
      },
      body: JSON.stringify({
        ...dataToSave,
      })
    })

    if(
      response.ok) {
      if(reload) {
        // You MUST call this.formSaved() after you save the form.
        this.formSaved();
      } else {
        return await response.json()
      }      
    }
    else {
      return Promise.reject(response.statusText)
    }
  }

  private async saveOnSecondaryList(data: JobItemDto): Promise<JobItemDto> {
    const {Id, Tag, ...dataToSave} = data
    let apiUrl = ''
    let method = ''

    if(this.formData.Id === null) {
      this.formData = await this.saveOnMainList(this.formData, false) 
    }

    if(Id) {
      apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items(${Id})`
      method = 'MERGE'
    }
    else {
      apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items`
      method = 'POST'
      dataToSave.DailyReportHomeOfficeId = this.formData.Id
    }    

    const response = await this.context.spHttpClient.fetch(apiUrl, SPHttpClient.configurations.v1,       {
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "odata-version": "",
        "IF-MATCH": Tag
      },
      body: JSON.stringify(dataToSave)
    })

    return response.ok ? response.json() : Promise.reject(response.statusText)
  }

  private async getItemsFromMainList(id: number): Promise<DailyReportDto> {
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items(${id})`

    const getDataResponse = await this.getData(apiUrl)
    const responseJson = await getDataResponse.json()

    if(!responseJson) {
      throw Error('Não foi possível localizar registros')
    }

    return {
      Id: responseJson.Id,
      EmployeeId: responseJson.EmployeeId,
      ManagerId: responseJson.ManagerId,
      Status: responseJson.Status,
      JobDate: new Date(responseJson.JobDate),
      Tag: responseJson['@odata.etag'],    
    }
  }

  private async getItemsFromSecondaryList(id: number): Promise<JobItemDto[]> { 
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items?$filter=DailyReportHomeOfficeId eq ${id}`

    const getDataResponse = await this.getData(apiUrl)
    const { value } : { value: ResponseJobItem[]} = await getDataResponse.json()

    if(value.length === 0) {
      throw Error('Não foi possível localizar registros')
    }

    return value.map((item) => {
      return {
        Id: item.Id,
        Title: item.Title,
        Description: item.Description,
        Status: item.Status,
        HoraExtra: item.HoraExtra,
        DailyReportHomeOfficeId: item.DailyReportHomeOfficeId,
        QuantidadeHoras: item.QuantidadeHoras,
        HomeOffice: item.HomeOffice,
        HoraInicio: new Date(item.HoraInicio),
        HoraFim: new Date(item.HoraFim),
        Tag: item['@odata.etag'],
      }
    })
  }
}
