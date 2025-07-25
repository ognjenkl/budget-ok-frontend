import CreateEnvelopeDto from "./create.envelope.dto.ts";
import CreateEnvelopeResponse from "./create.envelope.response.ts";
import axios from "axios";

export default async function createEnvelope(data: CreateEnvelopeDto): Promise<CreateEnvelopeResponse> {
  // Get base URL and port from environment variables at runtime
  const baseUrl = process.env.VITE_API_URL;
  const apiPort = process.env.VITE_API_PORT;

  if (!baseUrl || !apiPort) {
    throw new Error('VITE_API_URL and VITE_API_PORT environment variables must be set');
  }

  const api = `${baseUrl}:${apiPort}/api/envelopes`;
  const response = await axios.post(api, data);
  return response.data;
}
