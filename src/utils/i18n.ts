// translate router.meta.title, be used in breadcrumb sidebar tagsview
import i18n from "@/lang/index"

export function translateRouteTitleI18n(title: any) {
    // 判断是否存在国际化配置, 如果没有则原生返回
    const hasKey = i18n.global.te("route." + title);
    if (hasKey) {
        const translateTitle = i18n.global.t("route." + title);
        return translateTitle;
    }
    return title;
}