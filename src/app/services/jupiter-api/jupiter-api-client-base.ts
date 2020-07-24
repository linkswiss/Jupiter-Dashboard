// TODO generated client replace the discriminator
// find      _discriminator = "Amadeus.*"
// replace   _discriminator = "AMADEUS"


export class ApiConfig {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

export class ApiClientBase {
  constructor(private config: ApiConfig) {

  }

  transformOptions(options_: RequestInit): Promise<RequestInit> {
    let promise = new Promise<RequestInit>((resolve, reject) => {
      options_.headers['Authorization'] = `Bearer ${this.config.token}`;
      resolve(options_);
    });
    return promise;
  }
}
