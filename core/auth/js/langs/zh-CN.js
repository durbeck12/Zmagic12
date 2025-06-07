// 检查变量是否已定义，以避免覆盖
if (typeof window.auth_zh_CN === "undefined") {
    // 为中文定义翻译
    window.auth_zh_CN = {
        // 通用
        "app_name": "ZMagic12",
        "language": {
            "pt_PT": "Português (Portugal)",
            "en_US": "English (US)",
            "fr_FR": "Français (France)",
            "es_ES": "Español (España)",
            "de_DE": "Deutsch (Deutschland)",
            "zh_CN": "中文 (简体)"
        },

        // 登录
        "login": {
            "title": "访问您的账户",
            "email_label": "电子邮件",
            "password_label": "密码",
            "remember_me": "记住我",
            "submit_button": "登录",
            "register_link": "没有账户？",
            "forgot_password_link": "忘记密码？",
            "error_invalid_credentials": "无效的电子邮件或密码。",
            "error_empty_fields": "请填写所有字段。",
            "error_generic": "登录时出错。请重试。",
            "success_message": "登录成功！正在重定向...",
            "loading": "加载中...",
            "back_link": "返回首页",
            "offline_mode": "离线模式",
            "already_logged_in": "用户已登录：",
            "user_logged_in_message": "用户已登录",
            "logout_button": "退出登录",
            "continue_button": "继续使用此账户",
            "connection_restored": "连接已恢复",
            "connection_lost": "连接已断开",
            "connection_error": "连接错误"
        },

        // 注册
        "register": {
            "title": "创建您的账户",
            "name_label": "名称",
            "email_label": "电子邮件",
            "password_label": "密码",
            "confirm_password_label": "确认密码",
            "submit_button": "注册",
            "login_link": "已有账户？",
            "error_passwords_dont_match": "密码不匹配。",
            "error_email_in_use": "此电子邮件已被使用。",
            "error_generic": "注册过程中出错。请重试。",
            "success_message": "注册成功！正在重定向...",
            "back_link": "返回首页"
        },

        // 密码恢复
        "recovery": {
            "title": "恢复您的密码",
            "email_label": "电子邮件",
            "submit_button": "发送恢复链接",
            "login_link": "记起密码了？",
            "error_generic": "发送恢复电子邮件时出错。请重试。",
            "success_message": "恢复电子邮件已发送！请检查您的收件箱。",
            "back_link": "返回首页"
        },
        
        // 个人资料
        "profile": {
            "page_title": "用户资料 - ZMagic12",
            "title": "用户资料",
            "loading": "加载中...",
            "loading_activities": "正在加载活动...",
            "user_avatar": "用户头像",
            "user_type_prefix": "用户类型：加载中...",
            
            "tabs": {
                "personal_info": "个人信息",
                "account_settings": "账户设置",
                "activity": "活动",
                "subscription": "订阅"
            },
            
            "fields": {
                "full_name": "全名",
                "organization": "组织",
                "phone": "电话号码",
                "country": "国家",
                "newsletter": "通过电子邮件接收通知和新闻"
            },
            
            "account_settings": {
                "title": "账户设置",
                "email": "电子邮件",
                "role": "角色",
                "created_at": "账户创建于",
                "last_signin": "上次访问",
                "terms": "条款和条件",
                "security": "安全",
                "change_password": "更改密码"
            },
            
            "activity": {
                "title": "账户活动",
                "projects": "项目",
                "templates": "模板",
                "archived": "已归档",
                "last_accesses": "最近活动"
            },
            
            "subscription": {
                "title": "订阅信息",
                "current_plan": "当前计划",
                "start_date": "开始日期",
                "validity": "有效期至",
                "upgrade_plan": "升级计划"
            },
            
            "buttons": {
                "save": "保存更改",
                "cancel": "取消"
            }
        }
    };
}

// 导出翻译以兼容模块
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.auth_zh_CN;
} 