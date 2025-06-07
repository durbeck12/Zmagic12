// 检查变量是否已存在以避免重复声明
if (typeof window.zh_CN === 'undefined') {
    window.zh_CN = {
        // 仪表板
        "dashboard": {
            // 头部
            "header": {
                "new_project": "新建项目"
            },
            
            // 选项卡
            "tabs": {
                "projects": "我的项目",
                "archived": "已归档",
                "templates": "模板"
            },
            
            // 新建项目模态框
            "new_project_modal": {
                "title": "新建项目",
                "name_label": "项目名称",
                "description_label": "描述",
                "create_as_template": "创建为模板",
                "cancel_button": "取消",
                "create_button": "创建项目"
            },
            
            // 编辑项目模态框
            "edit_project_modal": {
                "title": "编辑项目",
                "name_label": "项目名称",
                "description_label": "描述",
                "cancel_button": "取消",
                "save_button": "保存更改"
            },
            
            // 项目
            "projects": {
                "empty_state": "您还没有任何项目。点击\"新建项目\"开始创建。",
                "created_at": "创建于",
                "last_modified": "最后修改",
                "edit": "编辑",
                "delete": "删除",
                "archive": "归档",
                "unarchive": "取消归档",
                "open": "打开",
                "make_template": "复制到模板",
                "use_template": "用作模板"
            },
            
            // 模板
            "templates": {
                "empty_state": "您还没有任何模板。您可以创建一个模板或将现有项目保存为模板。",
                "created_at": "创建于",
                "last_modified": "最后修改",
                "edit": "编辑",
                "delete": "删除",
                "make_regular": "转换为项目",
                "use_template": "用作模板"
            },
            
            // 已归档
            "archived": {
                "empty_state": "您没有任何已归档的项目。",
                "created_at": "创建于",
                "last_modified": "最后修改",
                "edit": "编辑",
                "delete": "删除",
                "unarchive": "取消归档"
            },
            
            // 删除确认模态框
            "delete_modal": {
                "title": "确认删除",
                "confirm_text": "您确定要删除项目",
                "warning": "此操作无法撤销。",
                "cancel_button": "取消",
                "delete_button": "删除项目"
            },
            
            // 从模板创建项目模态框
            "new_from_template": {
                "title": "从模板创建新项目",
                "name_label": "新项目名称",
                "description_label": "描述",
                "template_info": "基于模板",
                "cancel_button": "取消",
                "create_button": "创建项目"
            },
            
            // 项目创建模态框
            "project_created_modal": {
                "title": "项目已创建",
                "message": "项目",
                "message_end": "已成功创建，可在\"我的项目\"选项卡中查看。",
                "ok_button": "确定"
            },
            
            // 项目卡片
            "project_card": {
                "no_description": "无描述",
                "edit_button": "编辑项目",
                "created_label": "创建：",
                "updated_label": "更新：",
                "edit_button_title": "编辑",
                "archive_button_title": "归档",
                "delete_button_title": "删除",
                "unarchive_button_title": "取消归档",
                "use_template_button_title": "使用模板"
            },
            
            // 加载中
            "loading": "加载中...",
            
            // 成功消息
            "success": {
                "project_created": "项目创建成功",
                "project_updated": "项目更新成功",
                "project_deleted": "项目删除成功",
                "project_archived": "项目归档成功",
                "project_unarchived": "项目取消归档成功",
                "template_created": "模板创建成功",
                "project_copied": "项目成功复制到模板",
                "projects_updated": "项目更新成功"
            },
            
            // 错误消息
            "error": {
                "load_projects": "加载项目时出错。请重试。",
                "create_project": "创建项目时出错。请重试。",
                "update_project": "更新项目时出错。请重试。",
                "delete_project": "删除项目时出错。请重试。",
                "archive_project": "归档项目时出错。请重试。",
                "unarchive_project": "取消归档项目时出错。请重试。",
                "load_dashboard": "加载仪表板时出错。请重新加载页面。"
            }
        }
    };
}
