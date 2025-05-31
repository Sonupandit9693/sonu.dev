"use client";
import { ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const navLinks = [
		{ href: "/experience", label: "Experience" },
		{ href: "/projects", label: "Projects" },
		{ href: "/blogs", label: "Blogs" },
		{ href: "/contact", label: "Contact" },
		{ href: "/skills", label: "Technical Skills" },
	];

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-zinc-900/50 border-zinc-800"
				}`}
			>
				<div className="container flex items-center justify-between p-6 mx-auto">
					{/* Back Button */}
					<Link
						href="/"
						className="text-zinc-300 hover:text-zinc-100 duration-200"
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>

					{/* Desktop Links */}
					<div className="hidden md:flex gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-zinc-400 hover:text-zinc-100 duration-200"
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-zinc-400 hover:text-zinc-100"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>

				{/* Mobile Dropdown Menu */}
				{menuOpen && (
					<div className="md:hidden px-6 pb-6 pt-0">
						<div className="flex flex-col space-y-4">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-zinc-400 hover:text-zinc-100 duration-200"
									onClick={() => setMenuOpen(false)}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</header>
	);
};
