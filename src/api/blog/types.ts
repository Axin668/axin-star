import { global } from "@/types/global";

/**
 * 博客文章查询参数
 */
export interface ArticleQuery extends global.PageQuery {
    title?: string;
}

/**
 * 博客文章表单模型
 */
export interface UpdateArticleForm {
    id?: number;
    title?: string;
    content?: string;
    categories?: string[];
    tags?: string[];
    publish?: boolean | string | undefined
}