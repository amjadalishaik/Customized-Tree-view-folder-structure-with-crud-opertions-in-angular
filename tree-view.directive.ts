import {  Component,  EventEmitter,  HostListener,  Input,  OnInit,  Output} from "@angular/core";
@Component({
  selector: 'tree-view',
  template: ` <ng-container *ngFor="let item of ((data || {}).children || []); let i = index; first as isFirst" >
      <div style="clear: both;" [ngClass]="cls">
        <div class="tree-view-label"  [class.firstlabel]="item.id == '1'" (mouseenter)="hoverItem=item" (mouseleave)="hoverItem=null"> <label (click)="toggleAccordian(item)">
            <fa-icon matTooltip="collapse" *ngIf="item.active && item.children?.length > 0" [icon]="['fa', 'angle-down']"
              class="angle-down p5 cursor"> </fa-icon>
            <fa-icon matTooltip="expand" *ngIf="!item.active && item.children?.length > 0 " [icon]="['fa', 'angle-right']"
              class="angle-down p5 cursor"> </fa-icon>
             <span style="font-weight: bold;" *ngIf="!isEditActive" >
             {{item.name }}<span *ngIf="item.text">{{": "+ item.text}}</span>
            </span>
              <input *ngIf="isEditActive && ( item.text && item.text.length  > 0)" type="text" [(ngModel)]="item.text"   />
              <input *ngIf="isEditActive" type="text" [(ngModel)]="item.name"  (blur)="editorLostFocus()" />
          </label>
          <div class='icon-container' *ngIf="item==hoverItem ||  item.id == '1'" >
            <fa-icon matTooltip="Edit" [icon]="['fa', 'pencil-alt']" class="icons align-center p5 cursor"
              (click)="showEditor(item)"> </fa-icon>
            <fa-icon matTooltip="Add Folder" [icon]="['fa', 'folder']" *ngIf="item.children?.length > 0  || setRoot || pId == 'root'" (click)="addRoot(item)" class="icons align-center p5 cursor">
            </fa-icon>
            <fa-icon matTooltip="Add Child Folder" *ngIf="item.children?.length > 0 || setRoot || pId == 'root' " [icon]="['fa', 'folder-plus']" (click)="addChildFolder(item)"
              class="icons align-center p5 cursor"></fa-icon>
            <fa-icon matTooltip="Add Snippet" *ngIf="item.children?.length > 0 || setRoot || pId == 'root' " [icon]="['fa', 'plus']" (click)="addChild(item)"
              class="icons align-center p5 cursor"></fa-icon>
            <fa-icon matTooltip="Delete" [icon]="['fa', 'trash-alt']" (click)="deleteItem(item)"
              class="icons align-center p5 cursor"></fa-icon>
          </div>
        </div>
        <tree-view [data]="item" *ngIf="item.active" [cls]="'childcls'" [pId]="item.id"></tree-view>
      </div>
    </ng-container>`,
  styles: [`.childcls {
            margin-left: 40px;
            }

            .tree-view-label {
            display: inline-block;
            max-width: 100%;
            margin-bottom: 5px;
            font-weight: 500;
            width: 95%;
            padding: 5px;
            vertical-align: middle;
            }
            .firstlabel{
              background: #428bca5c;
            }

            .tree-view-label:hover {
            background: #428bca5c;
            }

            .tree-view-label label {
            font-weight: 500;
            width: 70%;
            cursor:pointer;
            }
            .tree-view-label label input{
            width: 90%
            }

            .angle-down {
            font-size: 24px;
            padding-right: 6px;
            height: auto;
            vertical-align: middle;
            }

            .icon-container {
            float: right;
            line-height: 26px;
            }
            .firstIcon{
              display: inline;
            }

            .tree-view-label:hover .icon-container {
            display: inline;
            }

            .icon-container .icons {
            padding:6px
        }`]
})

export class TreeViewDirective implements OnInit {
  @Input() public data: any = {};
  @Input() public pId: any;
  @Input() public cls: string;
  @Output() sendData = new EventEmitter<any>();

  isEditActive: boolean = false;
  editItem: any = null;
  editorFocused: boolean = false;
  hoverItem: any = null;
  itemCount: number = 1;
  setRoot = false;

  @HostListener('document:keydown', [ '$event' ])
  onKeydownHandler(event: KeyboardEvent) {
      this.sendData.emit(this.data);
  }
  constructor() {
  }

  ngOnInit() {
  }

  toggleAccordian(val) {
     val.active = !val.active
  }

  addRoot(itm){
    this.setRoot = true;
    this.itemCount++;
    let obj = {};
    obj['name'] = "Edit this dummy text";
    obj['id'] = 'New'+ this.itemCount.toString();
    obj['children'] = [];
    this.data.children.push(obj);
  }

  addChild(item: any){
    this.itemCount++;
      let obj = {
        "id": 'New'+ this.itemCount.toString(),
        "name": "Edit this dummy name",
        "text": "Edit this dummy text"
      }

      item.children.push(obj);

  }

  addChildFolder(item: any){
    this.itemCount++;
    let obj = {
      "id": 'New'+ this.itemCount.toString(),
      "name": "Edit this dummy name",
      "children":[{
        "id": 'New'+ (this.itemCount+1).toString(),
        "name": "Edit this dummy name",
        "text": "Edit this dummy text"
      }]
    }

    item.children.push(obj);
}

  deleteItem(item: any){
      if (item){
          this.data.children = this.data.children.filter(function( obj ) {
          return obj.id !== item.id;
        });
    }
}

showEditor(item: any){
    this.isEditActive = !this.isEditActive;
    this.editItem = item;
}

closeEditor(){
    this.editItem = null;
    this.editorFocused = false;
    this.isEditActive = false;
}

editorKeyDown(e: any, item){
      if (this.editItem && e.keyCode == 13){
        if(item.text && item.name){
        item.text = e.target.value;
        item.name = e.target.value;
        }

      this.closeEditor();
      }

  }

  editorLostFocus(){
      this.closeEditor();
  }

}
