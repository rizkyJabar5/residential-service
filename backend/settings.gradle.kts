rootProject.name = "residential-management"

pluginManagement {
    repositories {
        gradlePluginPortal()
        maven {
            setUrl("https://maven.vaadin.com/vaadin-prereleases")
        }
    }
    plugins {
        id("dev.hilla") version "2.5.6"
    }
}