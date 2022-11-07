import { Component, OnInit } from '@angular/core';
import { Team } from '../../classes/team';
import { TablesService } from '../../services/tables.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss']
})
export class AllTeamsComponent implements OnInit {



  isDarkEnable = false;
  allTeams: Team[] = null;

  constructor(private tableService: TablesService, private router: Router) { }

  ngOnInit(): void {

    this.tableService.getAllTeams().subscribe(
      (response: Team[]) => {
        this.allTeams = response;
      })

  }

}


