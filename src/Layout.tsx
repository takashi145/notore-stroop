interface LayoutProps {
	children: preact.ComponentChildren
}

export const Layout = ({ children }: LayoutProps) => {
	return (
		<div class="min-h-screen bg-blue-50 flex flex-col">
			<div class="flex-1 flex items-center justify-center">
				{children}
			</div>
			<footer class="p-4">
				© 2025 <a href="https://github.com/takashi145" class="underline">takashi145</a>
			</footer>
		</div>
	)
}
