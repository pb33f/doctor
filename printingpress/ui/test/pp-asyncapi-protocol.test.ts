import {describe, expect, it} from 'vitest';
import '../src/components/shared/asyncapi-protocol.js';
import {asyncAPIProtocolPresentation} from '../src/components/shared/asyncapi-protocol.js';

describe('pp-asyncapi-protocol', () => {
  it.each([
    ['amqp', 'AMQP', 'amqp'],
    ['amqp1', 'AMQP 1.0', 'amqp'],
    ['amqps', 'AMQPS', 'amqp'],
    ['anypoint-mq', 'ANYPOINT MQ', 'anypointmq'],
    ['gcp-pubsub', 'GOOGLE PUB/SUB', 'googlepubsub'],
    ['google-pubsub', 'GOOGLE PUB/SUB', 'googlepubsub'],
    ['ibm-mq', 'IBM MQ', 'ibmmq'],
    ['kafka', 'KAFKA', 'kafka'],
    ['kafka-secure', 'KAFKA', 'kafka'],
    ['mqtt5', 'MQTT 5', 'mqtt'],
    ['mqtts', 'MQTTS', 'mqtt'],
    ['secure-mqtt', 'MQTT', 'mqtt'],
    ['nats', 'NATS', 'nats'],
    ['pulsar', 'PULSAR', 'pulsar'],
    ['redis', 'REDIS', 'redis'],
    ['sns', 'SNS', 'sns'],
    ['solace', 'SOLACE', 'solace'],
    ['sqs', 'SQS', 'sqs'],
    ['stomp', 'STOMP', 'stomp'],
    ['stomps', 'STOMPS', 'stomp'],
    ['ws', 'WEBSOCKET', 'websocket'],
    ['websockets', 'WEBSOCKET', 'websocket'],
  ])('normalizes %s to %s with the %s mark', (protocol, label, mark) => {
    expect(asyncAPIProtocolPresentation(protocol)).toEqual({label, mark});
  });

  it('renders the Apache Kafka mark and uppercase label', async () => {
    const el = document.createElement('pp-asyncapi-protocol');
    el.setAttribute('protocol', 'kafka');
    el.setAttribute('size', 'large');
    el.setAttribute('heading', '');
    document.body.appendChild(el);
    await (el as HTMLElement & {updateComplete: Promise<unknown>}).updateComplete;

    const heading = el.shadowRoot?.querySelector('h1');
    expect(heading?.textContent?.trim()).toBe('KAFKA');
    const logo = heading?.querySelector('.mark.kafka svg[data-brand="apache-kafka"]');
    const path = logo?.querySelector('path')?.getAttribute('d') || '';
    expect(logo).toBeTruthy();
    expect(path.startsWith('M9.71 2.136')).toBe(true);
    expect(path).toContain('M8.683 22.295');
    expect(path.length).toBeGreaterThan(2400);
    expect(path.endsWith('-.141-1.118')).toBe(true);
    expect(heading?.querySelector('.mark')?.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([
    ['amqp', 'amqp'],
    ['anypointmq', 'mulesoft'],
    ['googlepubsub', 'google-pubsub'],
    ['ibmmq', 'ibm-mq'],
    ['mqtt', 'mqtt'],
    ['nats', 'nats'],
    ['pulsar', 'apache-pulsar'],
    ['redis', 'redis'],
    ['sns', 'aws-sns'],
    ['solace', 'solace-pubsub'],
    ['sqs', 'aws-sqs'],
    ['ws', 'websocket'],
  ])('renders the embedded %s protocol mark', async (protocol, brand) => {
    const el = document.createElement('pp-asyncapi-protocol');
    el.setAttribute('protocol', protocol);
    document.body.appendChild(el);
    await (el as HTMLElement & {updateComplete: Promise<unknown>}).updateComplete;

    const logo = el.shadowRoot?.querySelector(`svg[data-brand="${brand}"]`);
    expect(logo).toBeTruthy();
    expect(logo?.querySelector('path')?.getAttribute('d')?.length).toBeGreaterThan(20);
    el.remove();
  });

  it('keeps unknown protocols readable', () => {
    expect(asyncAPIProtocolPresentation('custom-bus')).toEqual({label: 'CUSTOM-BUS', mark: 'topology'});
  });
});
