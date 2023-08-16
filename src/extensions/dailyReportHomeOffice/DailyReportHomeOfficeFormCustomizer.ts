import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

import { DailyReportHomeOffice } from './components/DailyReportHomeOffice';
import { DailyReportHomeOfficeProps } from './components/DailyReportHomeOfficeProps';

import { Profile } from '../../interfaces/Profile';

import { SPHttpClient, HttpClientResponse } from '@microsoft/sp-http';  
import { JobItem } from '../../interfaces/JobItem';
import { DailyReportFormData } from '../../interfaces/DailyReportFormData';

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

  employeeProfile: Profile
  managerProfile: Profile

  isEmployee: boolean
  isManager: boolean

  public async onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    const {email: currentUserEmail} = this.context.pageContext.user

    this.employeeProfile = await this.getDataFromHierarquia(currentUserEmail)
    this.managerProfile = await this.getDataFromHierarquia(this.employeeProfile.EMAIL_1ST_EVALUATOR)

    this.isEmployee = currentUserEmail === this.employeeProfile.EMAIL_EMPLOYE
    this.isManager = currentUserEmail === this.managerProfile.EMAIL_EMPLOYE

    Log.info(LOG_SOURCE, 'Activated DailyReportHomeOfficeFormCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const dailyReportHomeOffice: React.ReactElement<{}> =
      React.createElement(DailyReportHomeOffice, {
        displayMode: this.displayMode,
        onSave: this._onSave.bind(this),
        employee: this.employeeProfile,
        manager: this.managerProfile,
        date: new Date(),
        items: [],
        isManager: this.isManager,
        isEmployee: this.isEmployee
       } as DailyReportHomeOfficeProps);

    ReactDOM.render(dailyReportHomeOffice, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = async (data: DailyReportFormData): Promise<void> => {
    await this.saveData(data)
    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
  }

  /*private _onClose =  (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }*/

  private async getDataFromHierarquia(email: string): Promise<Profile> {
    const listGuid = '1733062b-2634-43fc-8207-42fe20b40ac4'
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${listGuid}')/items?$filter=EMAIL_EMPLOYE eq '${email}'`

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

  private async saveData(data: DailyReportFormData): Promise<void> {
    const {Id, items, ...dataToSave} = data

    if(!Id) {
      const { Id } = await this.saveOnMainList(dataToSave)
      items.forEach((item) => {item.DailyReportHomeOfficeId = Id})

      await this.saveOnSecondaryList(items)
    }
  }

  private async saveOnMainList(data: Omit<DailyReportFormData, 'items' | 'Id'>): Promise<Omit<DailyReportFormData, 'items'>> {
    const mainListId = 'abe0a217-2715-4450-adc7-841cb33431d4'
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${mainListId}')/items'`
    

    const response = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
      body: JSON.stringify(data)
    })

    return response.ok ? response.json() : Promise.reject(response.statusText)
  }

  private async saveOnSecondaryList(items: JobItem[]): Promise<void> {
    const secondaryListId = 'c5f255aa-ed5d-418e-b2af-d7d48ddbf0fb'
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${secondaryListId}')/items'`

    const response = items.map((item) => {
      return this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
        body: JSON.stringify(item)
      })
    })    

    await Promise.all(response)
  }
}
