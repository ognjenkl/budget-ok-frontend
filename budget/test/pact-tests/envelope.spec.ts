
/* tslint:disable:no-unused-expression object-literal-sort-keys max-classes-per-file no-empty */
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import sinonChai from 'sinon-chai';
import { Pact, Interaction, Matchers, LogLevel } from '@pact-foundation/pact';

const expect = chai.expect;
import { EnvelopeService } from '../../src/api';
import {before, describe} from "node:test";
import CreateEnvelopeDto from "../../src/api/create.envelope.dto";
const { eachLike } = Matchers;

chai.use(sinonChai);
chai.use(chaiAsPromised);
const LOG_LEVEL = process.env.LOG_LEVEL || 'TRACE';

const url = 'http://127.0.0.1';
const apiPort = 8090;

describe('The Envelope API', () => {
  let envelopeService: EnvelopeService;

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

  before(() =>
      provider.setup().then((opts) => {
        envelopeService = new EnvelopeService({url, port: opts.port});
      })
  );

  after(() => provider.finalize());

  afterEach(() => provider.verify());

  describe('post /envelopes using object pattern', () => {
    before(() => {
      const body: CreateEnvelopeDto = {
        name: "Groceries",
        budget: 100,
      }

      return provider.addInteraction({
        state: 'i have a list of envelopes',
        uponReceiving: 'a request to add an envelope with the object pattern',
        withRequest: {
          method: 'POST',
          path: '/envelopes',
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
        name: "Groceries",
        budget: 100,
      }
      const res = await envelopeService.create(body);
      expect(res.data).to.deep.eq({
        id: 1,
        ...body,
      });
    })

  })
})
