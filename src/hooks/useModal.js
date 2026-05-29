import { useState, useEffect, useRef } from 'react';

export function useModal() {
    const dragStateRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

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