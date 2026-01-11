
import { Modal, ModalHeader, ModalFooter } from "../../ui/modal";
import { Button } from "../../ui/button";

interface SuccessModalProps {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  handleDoneAction: () => void;
}

export function SuccessModal({
  title,
  description,
  open,
  onClose,
  handleDoneAction,
}: SuccessModalProps) {
  return (
    <Modal open={open} className="max-w-110">
      <ModalHeader onClose={onClose}>
        <div className="flex flex-col items-center justify-center">
          <div>
            <img src="./images/check-circle.svg" alt="Check Circle" />
          </div>
          <h2 className="text-2xl font-bold text-primary-text mt-6 mb-2">
            {title}
          </h2>
          <p className=" text-center text-primary-text text-base tracking-[-0.01rem]">
            {description}
          </p>
        </div>
      </ModalHeader>

      <ModalFooter>
        <Button
          size="lg"
          variant="outline"
          type="button"
          onClick={() => handleDoneAction()}
          className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white"
        >
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
}
