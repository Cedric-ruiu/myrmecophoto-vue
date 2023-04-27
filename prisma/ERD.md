```mermaid
erDiagram

  contributor {
    Int id PK🗝️ 
    String name  "nullable"
    String pseudo  "nullable"
    String url  "nullable"
    }
  

  country {
    Int id PK🗝️ 
    String name  
    }
  

  form {
    Int id PK🗝️ 
    String name  
    }
  

  genus {
    Int id PK🗝️ 
    String name  
    String description  "nullable"
    }
  

  material {
    Int id PK🗝️ 
    String name  
    String description  "nullable"
    }
  

  researcher {
    Int id PK🗝️ 
    String name  
    String wiki_url  "nullable"
    }
  

  specie {
    Int id PK🗝️ 
    Int year  
    String name  
    String description  "nullable"
    }
  

  specimen {
    Int id PK🗝️ 
    String reference  "nullable"
    Float size_mm  "nullable"
    String capture_site  "nullable"
    String capture_date  "nullable"
    String description  "nullable"
    }
  

  subfamily {
    Int id PK🗝️ 
    String name  "nullable"
    String description  "nullable"
    }
  

  taxonomy_picture {
    Int id PK🗝️ 
    String date  "nullable"
    String file_name  
    String description  "nullable"
    }
  
    contributor o{--}o specimen : "specimen_specimen_collector_idTocontributor"
    contributor o{--}o specimen : "specimen_specimen_identifier_idTocontributor"
    country o{--}o specimen : "specimen"
    form o{--}o specimen : "specimen"
    genus o{--|| subfamily : "subfamily"
    genus o{--}o specie : "specie"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_lens_primary_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_camera_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_lighting_system_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_other_material_idTomaterial"
    material o{--}o taxonomy_picture : "taxonomy_picture_taxonomy_picture_lens_secondary_idTomaterial"
    researcher o{--}o specie : "specie"
    specie o{--|| researcher : "researcher"
    specie o{--|| genus : "genus"
    specie o{--}o specimen : "specimen"
    specimen o{--|o country : "country"
    specimen o{--|| form : "form"
    specimen o{--|o contributor : "contributor_specimen_collector_idTocontributor"
    specimen o{--|| specie : "specie"
    specimen o{--|o contributor : "contributor_specimen_identifier_idTocontributor"
    specimen o{--}o taxonomy_picture : "taxonomy_picture"
    subfamily o{--}o genus : "genus"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_lens_primary_idTomaterial"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_camera_idTomaterial"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_lighting_system_idTomaterial"
    taxonomy_picture o{--|| specimen : "specimen"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_other_material_idTomaterial"
    taxonomy_picture o{--|o material : "material_taxonomy_picture_lens_secondary_idTomaterial"
```
