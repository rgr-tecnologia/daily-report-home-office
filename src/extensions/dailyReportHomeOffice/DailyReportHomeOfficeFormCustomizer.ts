import * as React from "react";
import * as ReactDOM from "react-dom";

import { FormDisplayMode } from "@microsoft/sp-core-library";
import { BaseFormCustomizer } from "@microsoft/sp-listview-extensibility";

import { DailyReportHomeOffice } from "./components/DailyReportHomeOffice";
import { DailyReportHomeOfficeProps } from "./components/DailyReportHomeOfficeProps";

import { Profile, ProfileResponse } from "../../types/Profile";

import { SPHttpClient, HttpClientResponse } from "@microsoft/sp-http";
import { JobItemDto, UpdateJobItem } from "../../types/JobItem";
import {
  DailyReport,
  DailyReportCreate,
  DailyReportResponse,
  DailyReportUpdate,
} from "../../types/DailyReport";
import { Departamento } from "../../types/Departamento";

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IDailyReportHomeOfficeFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

export default class DailyReportHomeOfficeFormCustomizer extends BaseFormCustomizer<IDailyReportHomeOfficeFormCustomizerProperties> {
  colaboradoresListId = "2511179d-6e7d-4027-b73f-7136363f96f2";
  dailyReportListId = "abe0a217-2715-4450-adc7-841cb33431d4";
  dailyReportItemsListId = "c5f255aa-ed5d-418e-b2af-d7d48ddbf0fb";
  departamentosListId = "cd8b62cc-eaad-458a-a647-e2ef592d9b26";

  formData: DailyReport = {
    Id: null,
    Employee: null,
    Status: "Draft",
    JobDate: new Date(),
    ManagerUserProfileId: null,
    DataRetroativa: false, // Novo campo com valor padrão
    JustificativaRetroativa: null,
    DataRetroativaTexto: null,
  };

  isEmployee: boolean = true;
  isManager: boolean = false;

  jobItems: JobItemDto[] = [];

  public async getDepartamentoById(id: number): Promise<Departamento[]> {
    return this.getDataFromList<Departamento>(
      {
        Id: id,
      },
      this.departamentosListId
    );
  }

  public async getProfileByEmail(email: string): Promise<Profile> {
    const profile = (
      await this.getDataFromList<ProfileResponse>(
        {
          Email: email,
        },
        this.colaboradoresListId
      )
    )[0];

    const manager = await this.getProfileById(profile.GestorId);

    const departamento = (
      await this.getDepartamentoById(profile.DepartamentoId)
    )[0];

    return {
      ...profile,
      Gestor: manager,
      Departamento: departamento,
    };
  }

  public async getProfileById(id: number): Promise<ProfileResponse> {
    const profile = (
      await this.getDataFromList<ProfileResponse>(
        {
          Id: id,
        },
        this.colaboradoresListId
      )
    )[0];

    return profile;
  }

  public async onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    const currentUserLoginName = this.context.pageContext.user.loginName;
    const isMemberOfRh = await this.isMemberOfGroup(139);

    if (this.displayMode === FormDisplayMode.New) {
      this.formData.Employee = await this.getProfileByEmail(
        currentUserLoginName
      );

      const managerProfileResponse = await this.context.spHttpClient.post(
        "https://cjinter.sharepoint.com/sites/newportal/_api/web/ensureuser",
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logonName:
              "i:0#.f|membership|" + this.formData.Employee.Gestor.Email,
          }),
        }
      );

      const managerProfile = await managerProfileResponse.json();

      this.formData.ManagerUserProfileId = managerProfile.Id;
    } else {
      const dailyReport = (
        await this.getDataFromList<DailyReportResponse>(
          {
            Id: this.context.pageContext.listItem.id,
          },
          this.dailyReportListId
        )
      )[0];

      const jobItems = await this.getDataFromList<UpdateJobItem>(
        {
          DailyReportHomeOfficeId: this.context.pageContext.listItem.id,
        },
        this.dailyReportItemsListId
      );

      const employee = await this.getProfileById(dailyReport.EmployeeId);

      this.jobItems = jobItems.map((item) => ({
        ...item,
        HoraInicio: new Date(item.HoraInicio),
        HoraFim: new Date(item.HoraFim),
        DataRetroativa: item.DataRetroativa, // Inclua o novo campo
        JustificativaRetroativa: item.JustificativaRetroativa,
        DataRetroativaTexto: item.DataRetroativaTexto,
      }));

      this.formData = {
        Id: dailyReport.Id,
        Employee: await this.getProfileByEmail(employee.Email),
        Status: dailyReport.Status,
        JobDate: new Date(dailyReport.JobDate),
        ManagerUserProfileId: dailyReport.ManagerUserProfileId,
        DataRetroativa: dailyReport.DataRetroativa, // Inclua o novo campo
        JustificativaRetroativa: dailyReport.JustificativaRetroativa,
        DataRetroativaTexto: dailyReport.DataRetroativaTexto,
      };

      console.log("this.formData:::>>>",this.formData);

      this.isEmployee = this.formData.Employee.Email === currentUserLoginName;
      this.isManager =
        this.formData.Employee.Gestor.Email === currentUserLoginName ||
        isMemberOfRh;
    }
    return Promise.resolve();
  }

  public render(): void {
    const dailyReportHomeOffice: React.ReactElement<DailyReportHomeOfficeProps> =
      React.createElement(DailyReportHomeOffice, {
        displayMode: this.displayMode,
        onCreate: this.createDailyReport.bind(this),
        onUpdate: this.updateDailyReport.bind(this),
        onSaveSecondary: this.saveOnSecondaryList.bind(this),
        onDeleteSecondary: this.deleteItemFromSecondaryList.bind(this),
        formData: this.formData,
        items: this.jobItems,
        isEmployee: this.isEmployee,
        isManager: this.isManager,
      });

    ReactDOM.render(dailyReportHomeOffice, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private async getDataFromList<T>(
    data: Partial<T>,
    listId: string
  ): Promise<T[]> {
    const query = Object.keys(data)
      .map((key) => `${key} eq '${data[key as keyof T]}'`)
      .join(" and ");

    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${listId}')/items?$filter=${query}`;

    const getDataResponse = await this.getData(apiUrl);
    const responseJson = await getDataResponse.json();

    return responseJson.value;
  }

  private getApiUrl(): string {
    return this.context.pageContext.web.absoluteUrl;
  }

  private async getData(url: string): Promise<HttpClientResponse> {
    return await this.context.spHttpClient.get(
      url,
      SPHttpClient.configurations.v1
    );
  }

  private async getCurrentUserGroups(): Promise<any> {
    const queryUrl = `${this.getApiUrl()}/_api/web/currentuser/groups`;
    const siteGroupsData = await this.context.spHttpClient.get(
      queryUrl,
      SPHttpClient.configurations.v1
    );
    const siteGroups = (await siteGroupsData.json()).value;

    return siteGroups;
  }

  private async createDailyReport(
    data: DailyReportCreate
  ): Promise<DailyReportResponse> {
    const response = await this.context.spHttpClient.post(
      `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          DataRetroativa: data.DataRetroativa, // Inclua o novo campo
          DataRetroativaTexto: data?.DataRetroativaTexto,
          JustificativaRetroativa: data?.JustificativaRetroativa,
        }),
      }
    );

    if (response.ok) {
      const responseJson = await response.json();
      return {
        ...responseJson,
      };
    } else {
      return Promise.reject(response.statusText);
    }
  }

  private async updateDailyReport(
    id: number,
    data: DailyReportUpdate
  ): Promise<DailyReportResponse> {
    const response = await this.context.spHttpClient.fetch(
      `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportListId}')/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        method: "MERGE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "IF-MATCH": "*",
        },
        body: JSON.stringify({
          ...data,
          DataRetroativa: data.DataRetroativa, // Inclua o novo campo
          DataRetroativaTexto: data?.DataRetroativaTexto,
          JustificativaRetroativa: data?.JustificativaRetroativa,
        }),
      }
    );

    if (response.ok) {
      this.formSaved();
    } else {
      return Promise.reject(response.statusText);
    }
  }

  private async saveOnSecondaryList(data: JobItemDto): Promise<JobItemDto> {
    const { Id, ...dataToSave } = data;
    const apiUrl = Id
      ? `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items(${Id})`
      : `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items`;

    const method = Id !== null ? "MERGE" : "POST";

    try {
      const response = await this.context.spHttpClient.post(
        apiUrl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "IF-MATCH": "*",
            "X-HTTP-Method": method,
          },
          body: JSON.stringify({
            ...dataToSave,
          }),
        }
      );

      if (response.status === 204) {
        return;
      } else {
        const responseJson = await response.json();
        return {
          ...responseJson,
          HoraInicio: new Date(responseJson.HoraInicio),
          HoraFim: new Date(responseJson.HoraFim),
        };
      }
    } catch (error) {
      throw error;
    }
  }

  private async isMemberOfGroup(groupId: number): Promise<boolean> {
    const userGroups = await this.getCurrentUserGroups();
    const group = userGroups.find(
      (group: { Id: number }) => group.Id === groupId
    );
    return !!group;
  }

  private async deleteItemFromSecondaryList(id: number): Promise<void> {
    const apiUrl = `${this.getApiUrl()}/_api/web/lists(guid'${this.dailyReportItemsListId}')/items(${id})`;

    const response = await this.context.spHttpClient.fetch(
      apiUrl,
      SPHttpClient.configurations.v1,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "IF-MATCH": "*",
        },
      }
    );

    if (response.ok) {
      return response.json();
    } else {
      await Promise.reject(response.statusText);
    }
  }
}
