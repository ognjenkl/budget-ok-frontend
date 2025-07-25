
/* tslint:disable:no-unused-expression object-literal-sort-keys max-classes-per-file no-empty */

// Set environment variables BEFORE importing any modules that use them
const apiPort = 8090;
process.env.VITE_API_URL = 'http://localhost';
process.env.VITE_API_PORT = apiPort.toString();

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import sinonChai from 'sinon-chai';
import { Pact, Matchers, LogLevel } from '@pact-foundation/pact';
import { describe, before, after, afterEach, it } from 'mocha';
import CreateEnvelopeDto from "../../src/api/create.envelope.dto";
import createEnvelope from "../../src/api/createEnvelope.ts";

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

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



  before(async () => {
    await provider.setup();
  });

  after(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.verify();
  });

  describe('post /api/envelopes using object pattern', () => {
    before(async () => {
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
})
