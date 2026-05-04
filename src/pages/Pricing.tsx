import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pricingPlans } from '../data/pricingPlans';
import '../styles/Pricing.css';

const PriceIcon = ({ variant }: { variant: string }) => {
	if (variant === 'q1') {
		return (
			<svg
				className="icon icon-q1"
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden
			>
				<rect width="24" height="24" rx="6" fill="url(#g1)" />
				<defs>
					<linearGradient id="g1" x1="0" x2="1">
						<stop offset="0" stopColor="#ffd6e8" />
						<stop offset="1" stopColor="#ffb3da" />
					</linearGradient>
				</defs>
				<g fill="#fff">
					<path d="M7 10h10v2H7z" />
					<path d="M7 14h6v2H7z" />
				</g>
			</svg>
		);
	}

	if (variant === 'q2') {
		return (
			<svg
				className="icon icon-q2"
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden
			>
				<circle cx="12" cy="12" r="12" fill="url(#g2)" />
				<defs>
					<linearGradient id="g2" x1="0" x2="1">
						<stop offset="0" stopColor="#dbeafe" />
						<stop offset="1" stopColor="#c7d2fe" />
					</linearGradient>
				</defs>
				<g fill="#0f172a">
					<path d="M10 8h4v8h-2v-6h-2v-2z" />
				</g>
			</svg>
		);
	}

	return (
		<svg
			className="icon icon-q3"
			width="48"
			height="48"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden
		>
			<rect width="24" height="24" rx="6" fill="url(#g3)" />
			<defs>
				<linearGradient id="g3" x1="0" x2="1">
					<stop offset="0" stopColor="#d1fae5" />
					<stop offset="1" stopColor="#86efac" />
				</linearGradient>
			</defs>
			<g fill="#06304a">
				<path d="M7 9h10v2H7z" />
				<path d="M7 13h10v2H7z" />
			</g>
		</svg>
	);
};

const Pricing = () => {
	const navigate = useNavigate();
	const cardRefs = useRef<(HTMLElement | null)[]>([]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target as HTMLElement;
					if (entry.isIntersecting) {
						el.classList.add('in-view');
						observer.unobserve(el);
					}
				});
			},
			{ threshold: 0.15 }
		);

		cardRefs.current.forEach((el) => {
			if (el) {
				observer.observe(el);
			}
		});

		return () => observer.disconnect();
	}, []);

	const openContact = (event: React.MouseEvent<HTMLButtonElement>, planId: string) => {
		const button = event.currentTarget;
		const rect = button.getBoundingClientRect();
		const ripple = document.createElement('span');
		const size = Math.max(rect.width, rect.height) * 1.5;

		ripple.className = 'ripple';
		ripple.style.width = `${size}px`;
		ripple.style.height = `${size}px`;
		ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
		ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
		button.appendChild(ripple);

		setTimeout(() => {
			ripple.remove();
			navigate(`/pricing/${planId}/contact`);
		}, 180);
	};

	return (
		<div className="pricing-page">
			<div className="pricing-bg" aria-hidden />

			<header className="pricing-header pricing-intro">
				<h1>Alege abonamentul potrivit pentru tine</h1>
				<p className="subtitle">
					Organizeaza-ti depozitul mai simplu si mai eficient
				</p>
			</header>

			<main className="pricing-grid" role="list">
				{pricingPlans.map((plan, index) => (
					<article
						key={plan.id}
						role="listitem"
						ref={(el) => {
							cardRefs.current[index] = el;
						}}
						className={`plan-card ${plan.popular ? 'popular' : ''}`}
						aria-label={`${plan.title} - Prima luna este gratuita`}
					>
						<div className="plan-top">
							<div className="plan-icon">
								<PriceIcon variant={plan.id} />
							</div>
							<div className="plan-title">
								<div className="plan-name">{plan.title}</div>
								{plan.popular && (
									<div className="popular-pill">Cel mai popular</div>
								)}
							</div>
						</div>

						<div className="plan-price">
							<div className="monthly">
								{plan.monthly} MDL <span className="per">/ luna</span>
							</div>
							<div className="total">
								Total: {plan.total.toLocaleString('ro-RO')} MDL
							</div>
							<div className="first-free">Prima luna este gratuita</div>
						</div>

						<ul className="plan-features">
							{plan.features.map((feature) => (
								<li key={feature} className="feature-item">
									{feature}
								</li>
							))}
						</ul>

						<div className="plan-actions">
							<button
								type="button"
								className="choose-btn"
								onClick={(event) => openContact(event, plan.id)}
							>
								Alege planul
							</button>
							<Link to={`/pricing/${plan.id}/details`} className="learn-more">
								Detalii
							</Link>
						</div>
					</article>
				))}
			</main>
		</div>
	);
};

export default Pricing;

