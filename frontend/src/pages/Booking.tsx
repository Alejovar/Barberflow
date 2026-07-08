import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StepIndicator } from '@/components/booking/StepIndicator';
import { StepCustomer } from '@/components/booking/StepCustomer';
import { StepService } from '@/components/booking/StepService';
import { StepDate } from '@/components/booking/StepDate';
import { StepTime } from '@/components/booking/StepTime';
import { StepConfirm } from '@/components/booking/StepConfirm';
import { useBookingStore } from '@/store/booking';

export default function Booking() {
  const { step } = useBookingStore();

  return (
    <div>
      <Header />
      <main className="container-app max-w-2xl py-16">
        <StepIndicator current={step} />
        {step === 1 && <StepCustomer />}
        {step === 2 && <StepService />}
        {step === 3 && <StepDate />}
        {step === 4 && <StepTime />}
        {step === 5 && <StepConfirm />}
      </main>
      <Footer />
    </div>
  );
}
