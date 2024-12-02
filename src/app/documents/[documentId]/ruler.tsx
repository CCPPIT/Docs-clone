import React, { useRef, useState } from 'react'
import {FaCaretDown}from "react-icons/fa"


const markers=Array.from({length:83},(_,i)=>i)
export const Ruler = () => {
   
    const [leftMargin,setLefMargin]=useState(56)
    const [rightMargin,setRightMargin]=useState(56)
    const [isDragginLeft,setIsDraggingLeft]=useState(false)
    const [isDraggingRight,setIsDraggingRight]=useState(false);
    const rulerRef=useRef<HTMLDivElement>(null);
    const handleLeftMousDown=()=>{
        setIsDraggingLeft(true)
    }
    const handleRightMousDown=()=>{
        setIsDraggingRight(true)
    }
    const handleMouseMove = (e: React.MouseEvent) => {
        const PAGE_WIDTH=816
        // تحقق مما إذا كنا نقوم بالسحب من اليسار أو اليمين، وإذا كان العنصر المحدد موجودًا
        if ((isDragginLeft || isDraggingRight) && rulerRef.current) {
            // ابحث عن العنصر الحاوي للرسم
            const container = rulerRef.current.querySelector("#ruler-container");
            
            // تحقق مما إذا كان العنصر الحاوي موجودًا
            if (container) {
                // احصل على حدود العنصر الحاوي
                const containerRect = container.getBoundingClientRect();
                
                // احسب إحداثيات الماوس نسبةً إلى العنصر الحاوي
                const relativeX = e.clientX - containerRect.left;
                
                // قيد القيمة بين 0 و 816 (افترض أن 816 هو عرض الحاوية)
                const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));
                
                // إذا كنا نقوم بالسحب من اليسار
                if (isDragginLeft) {
                    // احسب أقصى موضع ممكن لليسار مع الأخذ في الاعتبار الهامش الأيمن
                    const maxLeftPosition = PAGE_WIDTH - rightMargin - 100;
                    
                    // احسب الموضع الجديد لليسار
                    const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
                    
                    // قم بتحديث الهامش الأيسر
                    setLefMargin(newLeftPosition);
                } 
                // إذا كنا نقوم بالسحب من اليمين
                else if (isDraggingRight) {
                    // احسب أقصى موضع ممكن لليمين مع الأخذ في الاعتبار الهامش الأيسر
                    const maxRightPosition = 816 - (leftMargin + 100);
                    
                    // احسب الموضع الجديد لليمين
                    const newRightPosition = Math.max(816 - rawPosition, 0);
                    
                    // قيد الموضع الجديد لليمين
                    const constrainedRightPosition = Math.min(newRightPosition, maxRightPosition);
                    
                    // قم بتحديث الهامش الأيمن
                    setRightMargin(constrainedRightPosition);
                }
            }
        }
    };
    const handleMouesUp=()=>{
        setIsDraggingLeft(false);
        setIsDraggingRight(false)
    }
    const handleLeftDoubleClick=()=>{
        setLefMargin(56)
    }
    const handleRegithDoubleClick=()=>{
        setRightMargin(56)
    }
  return (
    <div 
    ref={rulerRef}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouesUp}
    onMouseLeave={handleMouesUp}
    className='h-6 border-b border-gray-300 flex items-end relative select-none print:hidden'>
        <div id='ruler-container'
        className='max-w-[816px] mx-auto w-full h-full relative'
        >
            <Marker
            position={leftMargin}
            isLeft={true}
            isDragging={isDragginLeft}
            onMouseDown={handleLeftMousDown}
            onDoubleClick={handleLeftDoubleClick}
            />
             <Marker
            position={rightMargin}
            isLeft={false}
            isDragging={isDraggingRight}
            onMouseDown={handleRightMousDown}
            onDoubleClick={handleRegithDoubleClick}
            />
           <div className='absolute inset-0 bottom-0 h-full'>
            <div className='relative h-full w-[816px]'>
                {markers.map((marker)=>{
                    const position=(marker*816)/83;
                    return(
                        <div className='absolute bottom-0'
                        key={marker}
                        style={{left:`${position}px`}}
                        >
                            {marker%10===0&&(
                                <>
                                <div className='absolute bottom-0 w-[1px] h-2 bg-neutral-500'/>
                                <span className='absolute bottom-2 text-[10px] text-neutral-400 transform -translate-x-1/2'>
                                    {marker /10 +1}
                                </span>
                                </>
                            )}
                            {marker%5===0 &&marker%10 !==0&&(
                                <div className='absolute bottom-0 w-[1px] h-1.5 bg-neutral-500'/>
                            )}
                            {marker%5!==0&&(
                                <div className='absolute bottom-0 w-[1px] h-1 bg-neutral-500'/>

                            )}

                        </div>
                    )
                })}

            </div>

           </div>

        </div>
    </div>
  )
}
interface MarkerProps{
    position:number;
    isLeft:boolean;
    isDragging:boolean;
    onMouseDown:()=>void;
    onDoubleClick:()=>void
}
const Marker=({isDragging,position,isLeft,onDoubleClick,onMouseDown}:MarkerProps)=>{
    return(
        <div className='absolute top-0 w-4 h-full cursor-e-resize z-[5] group -ml-2'
        style={{[isLeft?"left":"right"]:`${position}px`}}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        >
            <FaCaretDown className='absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2'/>
<div className='absolute left-1/2 top-4 transform -transition-x-1/2'
style={{
    height:"100vh",
    width:"1px",
    transform:"scalex(0.5)",
    backgroundColor:"#3b72f6",
    display:isDragging?"block":"none"
}}
/>

        </div>
    )

}

