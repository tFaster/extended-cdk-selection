# Extended CDK Selection

This is an enhancement for the Angular CDK SelectionModel implementation.
It provides a controller for data tables and lists adding mouse and keyboard selection like other well known applications (i.e. Outlook, Windows file Explorer)

### Keyboard Navigation & Selection  
|  |  |  
|--|--|  
|↓/↑|Select next or previous item, current selection is cleared|  
|Ctrl+↑/↓|Move focus to next or previous item only|  
|Shift+↑/↓|Range select next or previous item, current selection is cleared|  
|Ctrl+Shift+↑/↓    |Range select next or previous item, adding to current selection|  
|Space|Select focused item, current selection is cleared|  
|Ctrl+Space|Toggle focused item, current selection is not cleared|  
|Ctrl+A|Select all items|  
  
  
###^Mouse & Keyboard Selection  
|  |  |  
|--|--|  
|Click|Select item, current selection is cleared|  
|Ctrl+Click|Toggle item, current selection is not cleared|  
|Shift+Click|Range select from focused item until clicked item, current selection is cleared|  
|Ctrl+Shift+Click|Range select from focused item until clicked item, adding to current selection|
