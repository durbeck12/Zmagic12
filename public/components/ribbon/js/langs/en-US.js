// Verifica se a variável já existe para evitar redeclaração
if (typeof window.ribbon_en_US === 'undefined') {
    window.ribbon_en_US = {
        // Traduções específicas para o Ribbon
        "ribbon": {
            // Traduções para as abas
            "tabs": {
                "projects": {
                    "label": "Projects",
                    "groups": {
                        "project-actions": {
                            "title": "Projects",
                            "buttons": {
                                "add-project-btn": {
                                    "label": "New"
                                }
                            }
                        },
                        "project-actions-2": {
                            "title": "My Projects",
                            "buttons": {
                                "my-projects-btn": {
                                    "label": "Projects"
                                },
                                "archived-projects-btn": {
                                    "label": "Archived"
                                },
                                "templates-btn": {
                                    "label": "Templates"
                                }
                            }
                        },
                        "account-actions": {
                            "title": "Account",
                            "buttons": {
                                "logout-btn": {
                                    "label": "Logout"
                                }
                            }
                        }
                    }
                },
                "forms": {
                    "label": "Forms",
                    "groups": {
                        "form-editors": {
                            "title": "Editors",
                            "buttons": {
                                "form-builder-btn": {
                                    "label": "Form Builder"
                                },
                                "ui-code-btn": {
                                    "label": "UI Code"
                                },
                                "tcmd-btn": {
                                    "label": "TCMD Code"
                                },
                                "qrc-btn": {
                                    "label": "QRC"
                                }
                            }
                        },
                        "project-io": {
                            "title": "Import/Export",
                            "buttons": {
                                "import-projects-btn": {
                                    "label": "Import"
                                },
                                "export-projects-btn": {
                                    "label": "Export"
                                }
                            }
                        },
                        "form-actions": {
                            "title": "Actions",
                            "buttons": {
                                "forms-save-btn": {
                                    "label": "Save"
                                },
                                "forms-preview-btn": {
                                    "label": "Preview"
                                }
                            }
                        }
                    }
                },
                "macros": {
                    "label": "Macros",
                    "groups": {
                        "macro-editors": {
                            "title": "Editors",
                            "buttons": {
                                "macro-editor-btn": {
                                    "label": "Macro Editor"
                                },
                                "macro-library-btn": {
                                    "label": "Library"
                                }
                            }
                        },
                        "macro-actions": {
                            "title": "Actions",
                            "buttons": {
                                "macros-save-btn": {
                                    "label": "Save"
                                },
                                "macro-backup-btn": {
                                    "label": "Backup"
                                }
                            }
                        }
                    }
                },
                "lowcode": {
                    "label": "Low Code",
                    "groups": {
                        "lowcode-editors": {
                            "title": "Editors",
                            "buttons": {
                                "flowcode-btn": {
                                    "label": "FlowCode"
                                },
                                "blockscript-btn": {
                                    "label": "BlockScript"
                                },
                                "freescript-btn": {
                                    "label": "FreeScript"
                                }
                            }
                        },
                        "lowcode-actions": {
                            "title": "Actions",
                            "buttons": {
                                "lowcode-save-btn": {
                                    "label": "Save"
                                },
                                "script-backup-btn": {
                                    "label": "Backup"
                                }
                            }
                        }
                    }
                },
                "details": {
                    "label": "Project Details",
                    "groups": {
                        "project-details": {
                            "title": "Details",
                            "buttons": {
                                "project-info-btn": {
                                    "label": "Information"
                                },
                                "marketplace-btn": {
                                    "label": "Marketplace"
                                }
                            }
                        },
                        "project-detail-actions": {
                            "title": "Actions",
                            "buttons": {
                                "details-save-btn": {
                                    "label": "Save"
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

// Exporta as traduções para compatibilidade com módulos
if (typeof module !== "undefined" && module.exports) {
    module.exports = window.ribbon_en_US;
} 