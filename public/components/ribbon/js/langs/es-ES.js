if (typeof window.ribbon_es_ES === 'undefined') {
    window.ribbon_es_ES = {
        "ribbon": {
            "tabs": {
                "projects": {
                    "label": "Proyectos",
                    "groups": {
                        "project-actions": {
                            "title": "Proyectos",
                            "buttons": {
                                "add-project-btn": {
                                    "label": "Nuevo"
                                }
                            }
                        },
                        "project-actions-2": {
                            "title": "Mis Proyectos",
                            "buttons": {
                                "my-projects-btn": {
                                    "label": "Proyectos"
                                },
                                "archived-projects-btn": {
                                    "label": "Archivados"
                                },
                                "templates-btn": {
                                    "label": "Plantillas"
                                }
                            }
                        },
                        "account-actions": {
                            "title": "Cuenta",
                            "buttons": {
                                "logout-btn": {
                                    "label": "Cerrar sesión"
                                }
                            }
                        }
                    }
                },
                "forms": {
                    "label": "Formularios",
                    "groups": {
                        "form-editors": {
                            "title": "Editores",
                            "buttons": {
                                "form-builder-btn": {
                                    "label": "Editor de Formularios"
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
                            "title": "Acciones",
                            "buttons": {
                                "forms-save-btn": {
                                    "label": "Guardar"
                                },
                                "forms-preview-btn": {
                                    "label": "Vista previa"
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
                            "title": "Acciones",
                            "buttons": {
                                "macros-save-btn": {
                                    "label": "Guardar"
                                },
                                "macro-backup-btn": {
                                    "label": "Copia de seguridad"
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
                            "title": "Acciones",
                            "buttons": {
                                "lowcode-save-btn": {
                                    "label": "Guardar"
                                },
                                "script-backup-btn": {
                                    "label": "Copia de seguridad"
                                }
                            }
                        }
                    }
                },
                "details": {
                    "label": "Detalles del Proyecto",
                    "groups": {
                        "project-details": {
                            "title": "Detalles",
                            "buttons": {
                                "project-info-btn": {
                                    "label": "Información"
                                },
                                "marketplace-btn": {
                                    "label": "Mercado"
                                }
                            }
                        },
                        "project-detail-actions": {
                            "title": "Acciones",
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
    module.exports = window.ribbon_es_ES;
}
