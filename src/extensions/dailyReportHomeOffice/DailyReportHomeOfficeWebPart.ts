// import * as React from 'react';
// import * as ReactDom from 'react-dom';

// import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { DailyReportHomeOffice } from './components/DailyReportHomeOffice';
// import { DailyReportHomeOfficeProps } from './components/DailyReportHomeOfficeProps';
// import { Profile } from '../../interfaces/Profile';

// import { SPHttpClient, HttpClientResponse } from '@microsoft/sp-http';  
// import { JobItem } from '../../interfaces/JobItem';
// import { DailyReportFormData } from '../../interfaces/DailyReportFormData';

// export default class DailyReportHomeOfficeWebPart extends BaseClientSideWebPart<DailyReportHomeOfficeProps> {
//   private employeeProfile: Profile;
//   private managerProfile: Profile;

//   private isEmployee: boolean;
//   private isManager: boolean;

//   public render(): void {
//     const element: React.ReactElement<DailyReportHomeOfficeProps> = React.createElement(
//       DailyReportHomeOffice,
//       {
//         employee: this.employeeProfile,
//         manager: this.managerProfile,
//         date: new Date(),
//         onSave: this.saveData.bind(this),
//         items: [],
//         isManager: this.isManager,
//         isEmployee: this.isEmployee
//       }
//     );

//     ReactDom.render(element, this.domElement);
//   }

//   protected onDispose(): void {
//     ReactDom.unmountComponentAtNode(this.domElement);
//   }

//   private async getDataFromHierarquia(email: string): Promise<Profile> {
//     const listGuid = '1733062b-2634-43fc-8207-42fe20b40ac4'
//     const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${listGuid}')/items?$filter=EMAIL_EMPLOYE eq '${email}'`

//     const getDataResponse = await this.getData(apiUrl)
//     const responseJson = await getDataResponse.json()

//     if(responseJson.value.length === 0) {
//       throw Error('Não foi possível localizar registros')
//     }

//     return responseJson.value[0]
//   }

//   private getApiUrl(): string {
//     return this.context.pageContext.web.absoluteUrl
//   }

//   private async getData(url: string): Promise<HttpClientResponse> {
//     return await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
//   }

//   protected async onInit(): Promise<void> {
//     const {email: currentUserEmail} = this.context.pageContext.user

//     this.employeeProfile = await this.getDataFromHierarquia(currentUserEmail)
//     this.managerProfile = await this.getDataFromHierarquia(this.employeeProfile.EMAIL_1ST_EVALUATOR)

//     this.isEmployee = currentUserEmail === this.employeeProfile.EMAIL_EMPLOYE
//     this.isManager = currentUserEmail === this.managerProfile.EMAIL_EMPLOYE
//   }

//   async saveData(data: DailyReportFormData): Promise<void> {
//     const {Id, items, ...dataToSave} = data

//     if(!Id) {
//       const { Id } = await this.saveOnMainList(dataToSave)
//       items.forEach((item) => {item.DailyReportHomeOfficeId = Id})

//       await this.saveOnSecondaryList(items)
//     }
//   }

//   async saveOnMainList(data: Omit<DailyReportFormData, 'items' | 'Id'>): Promise<Omit<DailyReportFormData, 'items'>> {
//     const mainListId = 'abe0a217-2715-4450-adc7-841cb33431d4'
//     const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${mainListId}')/items'`
    

//     const response = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
//       body: JSON.stringify(data)
//     })

//     return response.ok ? response.json() : Promise.reject(response.statusText)
//   }

//   async saveOnSecondaryList(items: JobItem[]): Promise<void> {
//     const secondaryListId = 'c5f255aa-ed5d-418e-b2af-d7d48ddbf0fb'
//     const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${secondaryListId}')/items'`

//     const response = items.map((item) => {
//       return this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
//         body: JSON.stringify(item)
//       })
//     })    

//     await Promise.all(response)
//   }
// }
