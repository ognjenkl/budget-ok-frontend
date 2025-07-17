import {Form} from "antd";

export default function CreateEnvelopeForm() {
  return (
    <Form>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the envelope name!' }]}
      >
        <input placeholder="Envelope Name" />
      </Form.Item>

      <Form.Item
        name="budget"
        label="Budget"
        rules={[{ required: true, message: 'Please input the budget amount!' }]}
      >
        <input type="number" placeholder="Budget Amount" />
      </Form.Item>

      <Form.Item>
        <button type="submit">Submit</button>
      </Form.Item>
    </Form>
  );
}
