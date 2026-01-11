"use client";

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ProgressIndicator,
  ListItem,
  ListItemTitle,
  ListItemDescription,
  IconContainer,
} from "../../ui/modal";

interface ProfileCompletionProps {
  steps: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    action: () => void;
  }[];
  setSteps?: () => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export function ProfileCompletionModal({
  steps,
  open,
  setOpen,
}: ProfileCompletionProps) {
  const completedCount = steps.filter((s) => s.completed).length;

  const icons = [
    "./images/mail.svg",
    "./images/phone.svg",
    "./images/personal-info.svg",
    "./images/upgrade-kyc.svg",
    "./images/enable-2fa.svg",
    "./images/make-transaction.svg",
  ];

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalHeader
        onClose={() => setOpen(false)}
        rightElement={
          <ProgressIndicator current={completedCount} total={steps.length} />
        }
      >
        <ModalTitle>Welcome to Zabira 👋</ModalTitle>
        <ModalDescription>
          Complete your account setup in a few easy steps
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <ListItem
              key={step.id}
              active={step.completed}
              onClick={() => {
                if (!step.completed) {
                  step.action();
                }
              }}
              icon={
                <IconContainer completed={step.completed}>
                  <div className="text-2xl">
                    <img src={icons[index]} alt={`${step.title} icon`} />
                  </div>
                </IconContainer>
              }
            >
              <ListItemTitle>{step.title}</ListItemTitle>
              <ListItemDescription>{step.description}</ListItemDescription>
            </ListItem>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}
