import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
	children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
	const modalRoot = document.body;

	useEffect(() => {
		// Prevent body scroll when modal is open
		document.body.style.overflow = "hidden";

		return () => {
			// Restore body scroll when modal is closed
			document.body.style.overflow = "unset";
		};
	}, []);

	return createPortal(children, modalRoot);
};

export default Portal;
