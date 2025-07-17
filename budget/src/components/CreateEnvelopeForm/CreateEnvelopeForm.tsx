import {Form, Input, InputNumber} from "antd";

export default function CreateEnvelopeForm() {
  return (
    <Form>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the envelope name!' }]}
      >
        <Input placeholder="Envelope Name" />
      </Form.Item>

      <Form.Item
        name="budget"
        label="Budget"
        rules={[{ required: true, message: 'Please input the budget amount!' }]}
      >
        <InputNumber placeholder="Budget Amount" />
      </Form.Item>

      <Form.Item>
        <button type="submit">Submit</button>
      </Form.Item>
    </Form>
  );
}
