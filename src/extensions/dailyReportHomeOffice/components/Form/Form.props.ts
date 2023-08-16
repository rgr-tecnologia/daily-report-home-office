import { Profile } from "../../../../interfaces/Profile";
import { NewFormProps } from "../NewForm/NewForm.props";

export interface FormProps extends NewFormProps {
    manager: Profile;
    employee: Profile;
    isManager: boolean
}