import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '@/store/booking';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const schema = z.object({
  customerName: z.string().min(2, 'Ingresa tu nombre completo'),
  customerEmail: z.string().email('Correo inválido'),
  customerPhone: z.string().min(7, 'Teléfono inválido'),
});

type FormValues = z.infer<typeof schema>;

export function StepCustomer() {
  const { customer, setCustomer, setStep } = useBookingStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: customer ?? undefined,
  });

  const onSubmit = (values: FormValues) => {
    setCustomer(values);
    setStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="font-display text-2xl font-medium">Cuéntanos quién eres</h2>
      <Input label="Nombre completo" placeholder="Juan Pérez" {...register('customerName')} error={errors.customerName?.message} />
      <Input label="Correo electrónico" type="email" placeholder="juan@correo.com" {...register('customerEmail')} error={errors.customerEmail?.message} />
      <Input label="Teléfono" placeholder="+52 844 123 4567" {...register('customerPhone')} error={errors.customerPhone?.message} />
      <div className="flex justify-end pt-2">
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
}
