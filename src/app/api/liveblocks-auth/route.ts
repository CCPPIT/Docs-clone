// استيراد المكتبات اللازمة
import { ConvexHttpClient } from "convex/browser"; // عميل Convex للتواصل مع API
import { Liveblocks } from "@liveblocks/node"; // مكتبة Liveblocks لإدارة الجلسات الحية
import { auth, currentUser } from "@clerk/nextjs/server"; // مكتبات Clerk لإدارة المصادقة
import { api } from "../../../../convex/_generated/api"; // استيراد API المولد بواسطة Convex

// إنشاء عميل Convex باستخدام URL الخاص به من المتغيرات البيئية
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// إعداد Liveblocks باستخدام مفتاح السر الخاص به من المتغيرات البيئية
const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!
});

// دالة معالجة طلب POST
export async function POST(req: Request) {
    // الحصول على معلومات الجلسة الحالية
    const { sessionClaims } = await auth();

    // التحقق مما إذا كانت الجلسة صالحة
    if (!sessionClaims) {
        return new Response("Unauthorized", { status: 401 }); // إذا لم تكن الجلسة صالحة، ارجع استجابة غير مصرح بها
    }
    console.log({sessionClaims})

    // الحصول على معلومات المستخدم الحالي
    const user = await currentUser();
    
    // التحقق مما إذا كان المستخدم مسجلاً
    if (!user) {
        return new Response("Unauthorized", { status: 401 }); // إذا لم يكن هناك مستخدم، ارجع استجابة غير مصرح بها
    }

    // الحصول على بيانات الغرفة من الطلب
    const { room } = await req.json();

    // استعلام للحصول على الوثيقة من Convex باستخدام معرف الغرفة
    const document = await convex.query(api.documents.getById, { id: room });
    
    // التحقق مما إذا كانت الوثيقة موجودة
    if (!document) {
        return new Response("Unauthorized", { status: 401 }); // إذا لم توجد الوثيقة، ارجع استجابة غير مصرح بها
    }

    // التحقق مما إذا كان المستخدم هو مالك الوثيقة أو عضو في المنظمة
    const isOwner = document.ownerId === user.id; // تحقق مما إذا كان المستخدم هو المالك
    const isOrganizationMember = !!(document.organizationId && document.organizationId === sessionClaims.org_id); // تحقق مما إذا كان المستخدم عضو في المنظمة
    //    console.log({isOwner,isOrganizationMember})
    // إذا لم يكن المستخدم مالكًا أو عضوًا في المنظمة، ارجع استجابة غير مصرح بها
    if (!isOwner && !isOrganizationMember) {
        return new Response("Unauthorized", { status: 401 });
    }
    const name=user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
    const nameToNumber=name.split("").reduce((acc,char)=>acc+char.charCodeAt(0),0);
    const hue=Math.abs(nameToNumber) %360;
    const color=`hsl(${hue},80%,60%)`


    // إعداد جلسة Liveblocks للمستخدم
    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
            name,// الاسم مع افتراضية "Anonymous" إذا لم يكن موجودًا
            avatar: user.imageUrl,
            color, // صورة المستخدم
        }
    });

    // السماح للجلسة بالوصول الكامل إلى الغرفة
    session.allow(room, session.FULL_ACCESS);

    // محاولة تفويض الجلسة
    const { body, status } = await session.authorize();
    
    // إرجاع الاستجابة مع الجسم والحالة
    return new Response(body, { status });
}