import CreateEnvelopeResponse from "./create.envelope.response.ts";
import axios from "axios";
import buildApiPrefix from "./buildApiPrefix.ts";
import FetchEnvelopeResponse from "./fetch.envelope.response.ts";

const apiPrefix = buildApiPrefix();
const api = `${apiPrefix}/envelopes`;

export default async function fetchEnvelopes(): Promise<FetchEnvelopeResponse[]> {
  const response = await axios.get(api);
  return response.data;
}
