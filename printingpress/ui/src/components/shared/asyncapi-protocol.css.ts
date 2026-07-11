import {css} from 'lit';

export default css`
  :host {
    display: inline-flex;
    min-width: 0;
    vertical-align: middle;
  }

  .protocol,
  h1 {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    margin: 0;
    padding: 0;
    gap: 0.45em;
    color: var(--primary-color);
    font-family: var(--font-stack-bold), monospace;
    font-weight: normal;
    letter-spacing: 0;
    line-height: 1;
  }

  h1 {
    color: var(--font-color);
    font-size: 2em;
    overflow-wrap: anywhere;
  }

  .mark {
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    width: 1.45em;
    height: 1.45em;
    border: 0.08em solid currentColor;
    border-radius: 50%;
    color: var(--primary-color);
    box-sizing: border-box;
  }

  .mark svg {
    width: 72%;
    height: 72%;
    overflow: visible;
  }

  .mark.amqp,
  .mark.anypointmq,
  .mark.googlepubsub,
  .mark.ibmmq,
  .mark.kafka,
  .mark.mqtt,
  .mark.nats,
  .mark.pulsar,
  .mark.redis,
  .mark.sns,
  .mark.solace,
  .mark.sqs,
  .mark.websocket {
    width: 1.25em;
    height: 1.25em;
    border: 0;
    border-radius: 0;
  }

  .mark.amqp svg,
  .mark.anypointmq svg,
  .mark.googlepubsub svg,
  .mark.ibmmq svg,
  .mark.kafka svg,
  .mark.mqtt svg,
  .mark.nats svg,
  .mark.pulsar svg,
  .mark.redis svg,
  .mark.sns svg,
  .mark.solace svg,
  .mark.sqs svg,
  .mark.websocket svg {
    width: 100%;
    height: 100%;
  }

  .mark.kafka {
    height: 1.55em;
  }

  .label {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .small {
    gap: 0.35em;
    font-size: 0.78em;
  }

  .medium {
    font-size: 0.92em;
  }

  .nav {
    gap: 0.4em;
    font-size: 1em;
  }

  .nav .mark {
    width: 1.2em;
    height: 1.2em;
  }

  .nav .mark.amqp,
  .nav .mark.anypointmq,
  .nav .mark.googlepubsub,
  .nav .mark.ibmmq,
  .nav .mark.kafka,
  .nav .mark.mqtt,
  .nav .mark.nats,
  .nav .mark.pulsar,
  .nav .mark.redis,
  .nav .mark.sns,
  .nav .mark.solace,
  .nav .mark.sqs,
  .nav .mark.websocket {
    width: 0.9em;
    height: 0.9em;
    border: 0;
  }

  .nav .mark.kafka {
    height: 1.15em;
  }

  .large {
    gap: 0.4em;
  }

  .large .mark {
    width: 1.25em;
    height: 1.25em;
    border-width: 0.06em;
  }

  .large .mark.amqp,
  .large .mark.anypointmq,
  .large .mark.googlepubsub,
  .large .mark.ibmmq,
  .large .mark.kafka,
  .large .mark.mqtt,
  .large .mark.nats,
  .large .mark.pulsar,
  .large .mark.redis,
  .large .mark.sns,
  .large .mark.solace,
  .large .mark.sqs,
  .large .mark.websocket {
    width: 1.05em;
    height: 1.05em;
    border: 0;
  }

  .large .mark.kafka {
    height: 1.3em;
  }
`;
