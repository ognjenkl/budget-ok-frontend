import axios, { AxiosPromise } from 'axios';
import CreateEnvelopeDto from "./create.envelope.dto.ts";

export class EnvelopeService {
  private url: string;
  private port: number;

  constructor(endpoint: { url: string; port: number }) {
    this.url = endpoint.url;
    this.port = endpoint.port;
  }

  public create = (createEnvelopeDto: CreateEnvelopeDto): AxiosPromise => {
    const baseURL = `${this.url}:${this.port}`;
    const fullUrl = `${baseURL}/envelopes`;
    return axios.post( fullUrl, createEnvelopeDto);
  };
}
