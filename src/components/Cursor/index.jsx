"use client"
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react'

const Cursor = () => {
    const size = 30;
    const circle = useRef()
    const mouse = useRef({
        x: 0,
        y: 0
    })
    const pos = useRef({
        x: 0,
        y: 0
    })
    const speed = 0.5; // Adjust this value for more or less easing

    const manualMouseMove = (e) => {
        const { clientX, clientY } = e;
        mouse.current = {
            x: clientX,
            y: clientY
        }
    }

    const moveCircle = () => {
        pos.current.x += (mouse.current.x - pos.current.x) * speed;
        pos.current.y += (mouse.current.y - pos.current.y) * speed;
        gsap.set(circle.current, { x: pos.current.x, y: pos.current.y, xPercent: -50, yPercent: -50 });
    }

    const animate = () => {
        moveCircle();
        window.requestAnimationFrame(animate);
    }

    useEffect(() => {
        animate();
        window.addEventListener('mousemove', manualMouseMove);
        return () => window.removeEventListener('mousemove', manualMouseMove);
    }, []);

    return (
        <div
            ref={circle}
            className='fixed top-0 left-0 bg-primary rounded-full mix-blend-difference pointer-events-none '
            style={{ width: size, height: size }}>
        </div>
    )
}

export default Cursor