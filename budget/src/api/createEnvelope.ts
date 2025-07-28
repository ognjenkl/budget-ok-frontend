import CreateEnvelopeDto from "./create.envelope.dto.ts";
import CreateEnvelopeResponse from "./create.envelope.response.ts";
import axios from "axios";
import buildApiPrefix from "./buildApiPrefix.ts";

const apiPrefix = buildApiPrefix();
const api = `${apiPrefix}/envelopes`;

export default async function createEnvelope(data: CreateEnvelopeDto): Promise<CreateEnvelopeResponse> {
  const response = await axios.post(api, data);
  return response.data;
}
