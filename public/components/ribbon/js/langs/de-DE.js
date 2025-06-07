if (typeof window.ribbon_de_DE === 'undefined') {
    window.ribbon_de_DE = {
        "ribbon": {
            "tabs": {
                "projects": {
                    "label": "Projekte",
                    "groups": {
                        "project-actions": {
                            "title": "Projekte",
                            "buttons": {
                                "add-project-btn": {
                                    "label": "Neu"
                                }
                            }
                        },
                        "project-actions-2": {
                            "title": "Meine Projekte",
                            "buttons": {
                                "my-projects-btn": {
                                    "label": "Projekte"
                                },
                                "archived-projects-btn": {
                                    "label": "Archiviert"
                                },
                                "templates-btn": {
                                    "label": "Vorlagen"
                                }
                            }
                        },
                        "account-actions": {
                            "title": "Konto",
                            "buttons": {
                                "logout-btn": {
                                    "label": "Abmelden"
                                }
                            }
                        }
                    }
                },
                "forms": {
                    "label": "Formulare",
                    "groups": {
                        "form-editors": {
                            "title": "Editoren",
                            "buttons": {
                                "form-builder-btn": {
                                    "label": "Formular-Editor"
                                },
                                "ui-code-btn": {
                                    "label": "UI-Code"
                                },
                                "tcmd-btn": {
                                    "label": "TCMD-Code"
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
                                    "label": "Importieren"
                                },
                                "export-projects-btn": {
                                    "label": "Exportieren"
                                }
                            }
                        },
                        "form-actions": {
                            "title": "Aktionen",
                            "buttons": {
                                "forms-save-btn": {
                                    "label": "Speichern"
                                },
                                "forms-preview-btn": {
                                    "label": "Vorschau"
                                }
                            }
                        }
                    }
                },
                "macros": {
                    "label": "Makros",
                    "groups": {
                        "macro-editors": {
                            "title": "Editoren",
                            "buttons": {
                                "macro-editor-btn": {
                                    "label": "Makro-Editor"
                                },
                                "macro-library-btn": {
                                    "label": "Bibliothek"
                                }
                            }
                        },
                        "macro-actions": {
                            "title": "Aktionen",
                            "buttons": {
                                "macros-save-btn": {
                                    "label": "Speichern"
                                },
                                "macro-backup-btn": {
                                    "label": "Sicherung"
                                }
                            }
                        }
                    }
                },
                "lowcode": {
                    "label": "Low Code",
                    "groups": {
                        "lowcode-editors": {
                            "title": "Editoren",
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
                            "title": "Aktionen",
                            "buttons": {
                                "lowcode-save-btn": {
                                    "label": "Speichern"
                                },
                                "script-backup-btn": {
                                    "label": "Sicherung"
                                }
                            }
                        }
                    }
                },
                "details": {
                    "label": "Projektdetails",
                    "groups": {
                        "project-details": {
                            "title": "Details",
                            "buttons": {
                                "project-info-btn": {
                                    "label": "Informationen"
                                },
                                "marketplace-btn": {
                                    "label": "Marktplatz"
                                }
                            }
                        },
                        "project-detail-actions": {
                            "title": "Aktionen",
                            "buttons": {
                                "details-save-btn": {
                                    "label": "Speichern"
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
    module.exports = window.ribbon_de_DE;
}
