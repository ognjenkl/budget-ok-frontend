
/* tslint:disable:no-unused-expression object-literal-sort-keys max-classes-per-file no-empty */

// Configuration for contract tests - using import.meta.env values set in vitest.contract.config.ts
import FetchEnvelopeResponse from "../../src/api/fetch.envelope.response.ts";

const apiPort = parseInt(import.meta.env.VITE_API_PORT || '8090');

import path from 'path';
import { Pact, Matchers, LogLevel } from '@pact-foundation/pact';
import { describe, beforeAll, afterAll, afterEach, it, expect } from 'vitest';
import CreateEnvelopeDto from "../../src/api/create.envelope.dto";
import createEnvelope from "../../src/api/createEnvelope.ts";
import fetchEnvelopes from "../../src/api/fetchEnvelopes.ts";
const LOG_LEVEL = import.meta.env.LOG_LEVEL || 'TRACE';

describe('The Envelope API', () => {
  const provider = new Pact({
    // port,
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2,
    consumer: 'Budget Client',
    provider: 'Budget API',
    logLevel: LOG_LEVEL as LogLevel,
    port: apiPort,
  });

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.verify();
  });

  describe('post /api/envelopes using object pattern', () => {
    beforeAll(async () => {
      const body: CreateEnvelopeDto = {
        name: "Rent",
        budget: 1200,
      }

      await provider.addInteraction({
        state: 'i have a list of envelopes',
        uponReceiving: 'a request to add an envelope with the object pattern',
        withRequest: {
          method: 'POST',
          path: '/api/envelopes',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: Matchers.like(1),
            ...body,
          },
        }
      });
    });

    it('returns the correct response', async () => {
      const body: CreateEnvelopeDto = {
        name: "Rent",
        budget: 1200,
      }
      const res = await createEnvelope(body);
      expect(res).to.deep.eq({
        id: 1,
        ...body,
      });
    })

  })

  describe('get /api/envelopes using object pattern', () => {

    beforeAll(async () => {
      const body: FetchEnvelopeResponse[] = [
        { id: "1", name: "Food", budget: 150 },
        { id: "2", name: "Books", budget: 100 },
        { id: "3", name: "Transport", budget: 80 },
      ]

      await provider.addInteraction({
        state: 'i have an empty list of envelopes',
        uponReceiving: 'a request to get all envelopes with the object pattern',
        withRequest: {
          method: 'GET',
          path: '/api/envelopes',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        }
      });
    });

    it('returns the correct response', async () => {
      const data = await fetchEnvelopes();
      expect(data).to.have.lengthOf(3);
      expect(data[0]).to.deep.eq({ id: "1", name: "Food", budget: 150 });
      expect(data[1]).to.deep.eq({ id: "2", name: "Books", budget: 100 });
      expect(data[2]).to.deep.eq({ id: "3", name: "Transport", budget: 80 });
    })
  })
})
