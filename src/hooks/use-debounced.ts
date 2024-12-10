// استيراد العناصر اللازمة من مكتبة React
import { useCallback, useRef } from "react";
// import { clearTimeout } from "timers"; // استيراد clearTimeout من مكتبة timers

// تعريف دالة `useDebounce` التي تستخدم لتنفيذ دالة بعد تأخير معين
export function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    callback: T, // الدالة التي سيتم تأخير تنفيذها
    delay: number = 500 // مدة التأخير (بالملي ثانية) مع قيمة افتراضية 500
) {
    // استخدام useRef لتخزين معرف المهلة (timeout) الحالي
    const timeoutRef = useRef<NodeJS.Timeout>();

    // استخدام useCallback لت memoize الدالة المعادة
    return useCallback((...args: Parameters<T>) => {
        // إذا كانت هناك مهلة قائمة، قم بإلغائها
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // إعداد مهلة جديدة لتنفيذ الدالة بعد فترة التأخير المحددة
        timeoutRef.current = setTimeout(() => {
            callback(...args); // استدعاء الدالة مع المعاملات المرسلة
        }, delay);
    }, [callback, delay]); // الدالة المعادة تعتمد على callback و delay
}