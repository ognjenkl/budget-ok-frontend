import { Form, Input, InputNumber } from "antd";
import useCreateEnvelope from "../../hooks/useCreateEnvelope.ts";

interface EnvelopeFormData {
  name: string;
  budget: number;
}

export default function CreateEnvelopeForm() {
  const [form] = Form.useForm<EnvelopeFormData>();
  const { mutate, isPending } = useCreateEnvelope();

  const handleSubmit = (values: EnvelopeFormData) => {
    mutate(values, {
      onSuccess: () => {
        form.resetFields();
      },
    })
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      data-testid="create-envelope-form"
    >
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
        <button type="submit" disabled={isPending} data-testid="submit-button">
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </Form.Item>
    </Form>
  );
}
