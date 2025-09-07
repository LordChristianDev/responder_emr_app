import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { QuickActionsProp } from "@/features/dashboard/types/homeTypes";

const QuickActionCard = ({ action }: { action: QuickActionsProp }) => {
	const { title, subTitle, url } = action

	return (
		<Link to={url} className="group flex-1 ">
			<Card className="medical-card hover:shadow-lg transition-all duration-200 border-2 border-primary/20 hover:border-primary/40">
				<CardContent className="p-6 text-center">
					<div className="mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center w-12 h-12 group-hover:bg-primary/20 transition-colors">
						<action.icon className="w-6 h-6 text-primary" />
					</div>
					<h3 className="font-semibold text-foreground">{title}</h3>
					<p className="text-sm text-muted-foreground">{subTitle}</p>
				</CardContent>
			</Card>
		</Link>
	);
}

export default QuickActionCard;