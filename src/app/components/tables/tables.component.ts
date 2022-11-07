import { Component, OnInit } from '@angular/core';
import { Flag } from '../../classes/flag';
import { Team } from '../../classes/team';
import { TablesService } from '../../services/tables.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  isDarkEnable = false;
  teams: Team[] = [];
  groupNames: string[] = [];
  allGroupsArray: any[] = null;
  flagsURL: string = "https://hatscripts.github.io/circle-flags/flags/";
  extension: string = ".svg";

  constructor(private tableService: TablesService) { }

  ngOnInit(): void {

    this.tableService.getAllTeams().subscribe(
      (response: Team[]) => {
        this.teams = response;

        const groups = new Set(this.teams.map(z => z.groupName))
        this.groupNames = [...groups]

        this.allGroupsArray = [
          this.teams.filter( (el, i) => el.groupName ==  "Group A").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group B").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group C").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group D").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group E").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group F").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group G").sort((a, b) => a.positionInTable - b.positionInTable),
          this.teams.filter( (el, i) => el.groupName ==  "Group H").sort((a, b) => a.positionInTable - b.positionInTable),
        ]
      },
      (error) => {
        console.log("Table component error: ", error );
      }
    )
  }



}
