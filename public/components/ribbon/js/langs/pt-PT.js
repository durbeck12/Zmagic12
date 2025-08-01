if (typeof window.ribbon_pt_PT === 'undefined') {
    window.ribbon_pt_PT = {
        "ribbon": {
            "tabs": {
                "projects": {
                    "label": "Projectos",
                    "groups": {
                        "project-actions": {
                            "title": "Projectos",
                            "buttons": {
                                "add-project-btn": {
                                    "label": "Novo"
                                }
                            }
                        },
                        "project-actions-2": {
                            "title": "Os Meus Projectos",
                            "buttons": {
                                "my-projects-btn": {
                                    "label": "Projectos"
                                },
                                "archived-projects-btn": {
                                    "label": "Arquivados"
                                },
                                "templates-btn": {
                                    "label": "Modelos"
                                }
                            }
                        },
                        "account-actions": {
                            "title": "Conta",
                            "buttons": {
                                "logout-btn": {
                                    "label": "Sair"
                                }
                            }
                        }
                    }
                },
                "forms": {
                    "label": "Formulários",
                    "groups": {
                        "form-editors": {
                            "title": "Editores",
                            "buttons": {
                                "form-builder-btn": {
                                    "label": "Editor de Formulários"
                                },
                                "ui-code-btn": {
                                    "label": "Código UI"
                                },
                                "tcmd-btn": {
                                    "label": "Código TCMD"
                                },
                                "qrc-btn": {
                                    "label": "QRC"
                                }
                            }
                        },
                        "project-io": {
                            "title": "Importar/Exportar",
                            "buttons": {
                                "import-projects-btn": {
                                    "label": "Importar"
                                },
                                "export-projects-btn": {
                                    "label": "Exportar"
                                }
                            }
                        },
                        "form-actions": {
                            "title": "Acções",
                            "buttons": {
                                "forms-save-btn": {
                                    "label": "Guardar"
                                },
                                "forms-preview-btn": {
                                    "label": "Visualizar"
                                }
                            }
                        }
                    }
                },
                "macros": {
                    "label": "Macros",
                    "groups": {
                        "macro-editors": {
                            "title": "Editores",
                            "buttons": {
                                "macro-editor-btn": {
                                    "label": "Editor de Macros"
                                },
                                "macro-library-btn": {
                                    "label": "Biblioteca"
                                }
                            }
                        },
                        "macro-actions": {
                            "title": "Acções",
                            "buttons": {
                                "macros-save-btn": {
                                    "label": "Guardar"
                                },
                                "macro-backup-btn": {
                                    "label": "Cópia de Segurança"
                                }
                            }
                        }
                    }
                },
                "lowcode": {
                    "label": "Low Code",
                    "groups": {
                        "lowcode-editors": {
                            "title": "Editores",
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
                            "title": "Acções",
                            "buttons": {
                                "lowcode-save-btn": {
                                    "label": "Guardar"
                                },
                                "script-backup-btn": {
                                    "label": "Cópia de Segurança"
                                }
                            }
                        }
                    }
                },
                "details": {
                    "label": "Detalhes do Projecto",
                    "groups": {
                        "project-details": {
                            "title": "Detalhes",
                            "buttons": {
                                "project-info-btn": {
                                    "label": "Informações"
                                },
                                "marketplace-btn": {
                                    "label": "Mercado"
                                }
                            }
                        },
                        "project-detail-actions": {
                            "title": "Acções",
                            "buttons": {
                                "details-save-btn": {
                                    "label": "Guardar"
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
    module.exports = window.ribbon_pt_PT;
}
