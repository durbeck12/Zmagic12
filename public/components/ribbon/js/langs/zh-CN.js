if (typeof window.ribbon_zh_CN === 'undefined') {
    window.ribbon_zh_CN = {
        "ribbon": {
            "tabs": {
                "projects": {
                    "label": "项目",
                    "groups": {
                        "project-actions": {
                            "title": "项目",
                            "buttons": {
                                "add-project-btn": {
                                    "label": "新建"
                                }
                            }
                        },
                        "project-actions-2": {
                            "title": "我的项目",
                            "buttons": {
                                "my-projects-btn": {
                                    "label": "项目"
                                },
                                "archived-projects-btn": {
                                    "label": "已归档"
                                },
                                "templates-btn": {
                                    "label": "模板"
                                }
                            }
                        },
                        "account-actions": {
                            "title": "账户",
                            "buttons": {
                                "logout-btn": {
                                    "label": "退出"
                                }
                            }
                        }
                    }
                },
                "forms": {
                    "label": "表单",
                    "groups": {
                        "form-editors": {
                            "title": "编辑器",
                            "buttons": {
                                "form-builder-btn": {
                                    "label": "表单构建器"
                                },
                                "ui-code-btn": {
                                    "label": "UI代码"
                                },
                                "tcmd-btn": {
                                    "label": "TCMD代码"
                                },
                                "qrc-btn": {
                                    "label": "QRC"
                                }
                            }
                        },
                        "project-io": {
                            "title": "导入/导出",
                            "buttons": {
                                "import-projects-btn": {
                                    "label": "导入"
                                },
                                "export-projects-btn": {
                                    "label": "导出"
                                }
                            }
                        },
                        "form-actions": {
                            "title": "操作",
                            "buttons": {
                                "forms-save-btn": {
                                    "label": "保存"
                                },
                                "forms-preview-btn": {
                                    "label": "预览"
                                }
                            }
                        }
                    }
                },
                "macros": {
                    "label": "宏",
                    "groups": {
                        "macro-editors": {
                            "title": "编辑器",
                            "buttons": {
                                "macro-editor-btn": {
                                    "label": "宏编辑器"
                                },
                                "macro-library-btn": {
                                    "label": "库"
                                }
                            }
                        },
                        "macro-actions": {
                            "title": "操作",
                            "buttons": {
                                "macros-save-btn": {
                                    "label": "保存"
                                },
                                "macro-backup-btn": {
                                    "label": "备份"
                                }
                            }
                        }
                    }
                },
                "lowcode": {
                    "label": "低代码",
                    "groups": {
                        "lowcode-editors": {
                            "title": "编辑器",
                            "buttons": {
                                "flowcode-btn": {
                                    "label": "流程代码"
                                },
                                "blockscript-btn": {
                                    "label": "块脚本"
                                },
                                "freescript-btn": {
                                    "label": "自由脚本"
                                }
                            }
                        },
                        "lowcode-actions": {
                            "title": "操作",
                            "buttons": {
                                "lowcode-save-btn": {
                                    "label": "保存"
                                },
                                "script-backup-btn": {
                                    "label": "备份"
                                }
                            }
                        }
                    }
                },
                "details": {
                    "label": "项目详情",
                    "groups": {
                        "project-details": {
                            "title": "详情",
                            "buttons": {
                                "project-info-btn": {
                                    "label": "信息"
                                },
                                "marketplace-btn": {
                                    "label": "市场"
                                }
                            }
                        },
                        "project-detail-actions": {
                            "title": "操作",
                            "buttons": {
                                "details-save-btn": {
                                    "label": "保存"
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = window.ribbon_zh_CN;
}
