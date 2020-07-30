
export class UserSettings {
    Endpoints: Endpoint[];
}

export class Endpoint {
    Name: string;
    Url: string;
    Default = false;
}