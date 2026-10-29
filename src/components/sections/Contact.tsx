import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let’s plan your next escape"
          description="Share a few details and a travel designer will send you a tailored outline."
        />
        <ContactForm />
      </Container>
    </section>
  );
}
