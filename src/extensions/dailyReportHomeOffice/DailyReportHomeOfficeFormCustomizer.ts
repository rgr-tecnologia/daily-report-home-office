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
import { DailyReportDto, GetDailyReportDto } from '../../interfaces/DailyReport';

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

  employeeProfile: Profile
  managerProfile: Profile

  isEmployee: boolean
  isManager: boolean

  items: JobItemDto[]
  initialDate: Date

  public async onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    const {email: currentUserEmail} = this.context.pageContext.user

    if(this.displayMode === FormDisplayMode.New) {
      this.employeeProfile = await this.getDataFromHierarquia({EMAIL_EMPLOYE: currentUserEmail})
      this.managerProfile = await this.getDataFromHierarquia({EMAIL_1ST_EVALUATOR: this.employeeProfile.EMAIL_1ST_EVALUATOR})

      this.isEmployee = true
      this.isManager = false

      Log.info(LOG_SOURCE, 'Activated DailyReportHomeOfficeFormCustomizer with properties:');
      Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
      return Promise.resolve();
    }
    else {
      const item = await this.getItemsFromMainList(this.context.item.ID)
      this.initialDate = new Date(item.CreatedAt)
      
      this.employeeProfile = await this.getDataFromHierarquia({Id: item.EmployeeId})
      this.managerProfile = await this.getDataFromHierarquia({Id: item.ManagerId})

      this.isEmployee = this.employeeProfile.EMAIL_EMPLOYE === currentUserEmail
      this.isManager = this.managerProfile.EMAIL_EMPLOYE === currentUserEmail

      this.items = await this.getItemsFromSecondaryList(this.context.item.ID)

      Log.info(LOG_SOURCE, 'Activated DailyReportHomeOfficeFormCustomizer with properties:');
      Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
      return Promise.resolve();      
    }
  }

  public render(): void {
    const dailyReportHomeOffice: React.ReactElement<DailyReportHomeOfficeProps> =
      React.createElement(DailyReportHomeOffice, {
        displayMode: this.displayMode,
        onSave: this._onSave.bind(this),
        employee: this.employeeProfile,
        manager: this.managerProfile,
        date: this.initialDate,
        items: this.items,
        isManager: this.isManager,
        isEmployee: this.isEmployee
       });

    ReactDOM.render(dailyReportHomeOffice, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = async (data: DailyReportDto): Promise<void> => {
    await this.saveData(data)
    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
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
      query = `${key} eq ${data[key]}`
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

  private async saveData(data: DailyReportDto): Promise<void> {
    const {items, ...dataToSave} = data

    const { Id } = await this.saveOnMainList(dataToSave)
    items.forEach((item) => {item.DailyReportHomeOfficeId = Id})

    await this.saveOnSecondaryList(items)
  }

  private async saveOnMainList(data: DailyReportDto): Promise<DailyReportDto> {
    
    // create a new item in the main list
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items'`
    

    const response = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
      body: JSON.stringify(data)
    })

    // return the new item
    return response.ok ? response.json() : Promise.reject(response.statusText)
  }

  private async saveOnSecondaryList(items: JobItemDto[]): Promise<void> {
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items'`

    const response = items.map((item) => {
      return this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
        body: JSON.stringify(item)
      })
    })    

    await Promise.all(response)
  }

  private async getItemsFromMainList(id: number): Promise<GetDailyReportDto> {
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items?$filter=Id eq ${id}`

    const getDataResponse = await this.getData(apiUrl)
    const responseJson = await getDataResponse.json()

    if(responseJson.value.length === 0) {
      throw Error('Não foi possível localizar registros')
    }

    return responseJson.value[0]
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
        CreatedAt: new Date(item.CreatedAt),
        HoraInicio: new Date(item.HoraInicio),
        HoraFim: new Date(item.HoraFim)
      }
    })
  }
}
