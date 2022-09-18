import { Component, OnInit } from '@angular/core';
import { Flag } from '../classes/flag';
import { Team } from '../classes/team';
import { TablesService } from '../services/tables.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  isDarkEnable = false;
  teams: Team[];
  groupNames: string[]
  allGroupsArray: any[]
  flagsURL: string = "https://hatscripts.github.io/circle-flags/flags/"
  extension: string = ".svg"

  constructor(private tableService: TablesService) { }

  ngOnInit(): void {

    this.tableService.getAllTeams().subscribe(
      (response: Team[]) => {
        this.teams = response;
        console.log("TEAMS:", this.teams);

        this.teams.forEach(z => console.log((z.groupName)))
        const groups = new Set(this.teams.map(z => z.groupName))
        this.groupNames = [...groups]
        console.log('this.groups:', this.groupNames)

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
        console.log('allGroupsArray:', this.allGroupsArray)

      },
      (error) => {
        console.log("Table component error");
      }
    )

    //================================================
    // this.tableService.getCountryFlags().subscribe(
    //   (response) => {
    //     console.log('res1:', response)
    //     this.flagUrl = response
    //     console.log('this.flagUrl:', this.flagUrl)
    //   },
    //   (error) => {
    //     console.log("Flags error: ", error);
    //   }
    // )

    //================================================
    // this.tableService.getCountryFlagsFromJson().subscribe(
    //   (response) => {
    //     console.log('res:2', response)
    //     this.flagsArray = response
    //     console.log('this.flagsArray:', this.flagsArray)
    //   },
    //   (error) => {
    //     console.log("Flags error: ", error);
    //   }
    // )
  }



}
