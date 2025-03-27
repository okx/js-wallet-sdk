import { StrKey } from './strkey';
import { scValToNative } from './scval';

/**
 * Converts raw diagnostic or contract events into something with a flatter,
 * human-readable, and understandable structure.
 *
 * @param {xdr.DiagnosticEvent[] | xdr.ContractEvent[]} events  either contract
 *    events or diagnostic events to parse into a friendly format
 *
 * @returns {SorobanEvent[]}  a list of human-readable event structures, where
 *    each element has the following properties:
 *  - type: a string of one of 'system', 'contract', 'diagnostic
 *  - contractId?: optionally, a `C...` encoded strkey
 *  - topics: a list of {@link scValToNative} invocations on the topics
 *  - data: similarly, a {@link scValToNative} invocation on the raw event data
 */
export function humanizeEvents(events) {
  return events.map((e) => {
    // A pseudo-instanceof check for xdr.DiagnosticEvent more reliable
    // in mixed SDK environments:
    if (e.inSuccessfulContractCall) {
      return extractEvent(e.event());
    }

    return extractEvent(e);
  });
}

function extractEvent(event) {
  return {
    ...(typeof event.contractId === 'function' &&
      event.contractId() != null && {
        contractId: StrKey.encodeContract(event.contractId())
      }),
    type: event.type().name,
    topics: event
      .body()
      .value()
      .topics()
      .map((t) => scValToNative(t)),
    data: scValToNative(event.body().value().data())
  };
}
