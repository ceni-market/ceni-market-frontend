import { useState, useEffect, useRef } from 'react';

export function useModal(isChatOpen) {
    const dragStateRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
            if (!isChatOpen) return;

            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";

            return () => {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                window.scrollTo(0, scrollY);
            };
    }, [isChatOpen]);

    useEffect(() => {
        const handlePointerMove = (event) => {
            if (!dragStateRef.current) return;

            const { startX, startY, originX, originY } = dragStateRef.current;
            setPosition({
                x: originX + event.clientX - startX,
                y: originY + event.clientY - startY,
            });
        };

        const handlePointerUp = () => {
            dragStateRef.current = null;
            setIsDragging(false);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    const handleHeaderPointerDown = (event) => {
        if (event.target.closest('input, button')) return;

        dragStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
        };
        setIsDragging(true);
    };

    return { position, isDragging, handleHeaderPointerDown };
}