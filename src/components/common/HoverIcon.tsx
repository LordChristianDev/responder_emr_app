import { useState } from "react";
import { Sidebar } from "lucide-react";
import { Button } from "@/components/ui/button"

import logo from "/images/logos/resq.png";

const HoverIcon = ({ toggle }: { toggle: () => void }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggle}
			aria-label="Toggle sidebar"
			className="text-muted-foreground cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{isHovered
				? <Sidebar />
				: <img src={logo} alt="logo" className="w-[4rem]" />}
		</Button>
	);
}

export default HoverIcon;