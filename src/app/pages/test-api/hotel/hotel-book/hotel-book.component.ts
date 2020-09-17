import {Component, OnInit, ViewChild} from '@angular/core';
import {NbAccordionItemComponent, NbDateService, NbDialogService} from '@nebular/theme';
import Utils from '../../../../utility/utils';
import {
  Address, BusinessCompany,
  CreditCardInfo,
  ECreditCardType,
  EDocumentType,
  EH2HConnectorCode,
  EH2HOperation, Email,
  EPaxGender,
  EPaxType,
  ESabreBookStatus, ETripType, ExtraToBook,
  IHGHotelBookInputCustomData,
  JupiterHotelBookInput,
  JupiterHotelBookRQ,
  JupiterHotelBookRS,
  PaxBook,
  PaxDocument, PaxLoyaltyCard, PaxRequest, Phone, RoomRequest,
  RoomToBook,
  SabreBookingReference,
  SabreSynXisHotelBookInputCustomData,
  Transportation,
  TransportInfo,
  TravelCompany
} from '../../../../services/jupiter-api/jupiter-api-client';
import {JupiterApiService} from '../../../../services/jupiter-api/jupiter-api.service';
import {AppConfigService} from '../../../../services/app-config/app-config.service';
import {DialogApiErrorComponent} from '../../common/components/dialog-api-error/dialog-api-error.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {DataInputSettings} from '../../common/components/form-data-inputs/form-data-inputs.component';
import {CustomDataInputSettings} from '../../common/components/custom-data-inputs/custom-data-inputs.component';

@Component({
  selector: 'jupiter-hotel-book',
  templateUrl: './hotel-book.component.html',
  styleUrls: ['./hotel-book.component.scss']
})
export class HotelBookComponent implements OnInit {
  @ViewChild('accordionItemRq', {static: true}) accordionItemRq: NbAccordionItemComponent;

  utils = Utils;
  loading = false;

  jupiterHotelBookRQ: JupiterHotelBookRQ = null;
  jupiterHotelBookRS: JupiterHotelBookRS = null;

  showPricePerDay = false;
  daysCount = 0;

  EPaxType = EPaxType;
  EPaxTypeList = Object.keys(EPaxType);

  EH2HConnectorCode = EH2HConnectorCode;
  connectors: EH2HConnectorCode[] = null;

  constructor(private dialogService: NbDialogService, protected dateService: NbDateService<Moment>, private jupiterApiService: JupiterApiService, public appConfigService: AppConfigService) {
  }

  ngOnInit() {
    // Get Connectors Enabled to operation
    this.connectors = this.appConfigService.getConnectorsEnabledToOperation(EH2HOperation.HOTEL_BOOK);

    // this.jupiterHotelBookRQ = this.hotelPagesService.initJupiterHotelAvailabilityRQ();
    // this.jupiterHotelBookRS = this.hotelPagesService.initJupiterHotelAvailabilityRS();

    let fromDate = moment().add(1, 'days');
    let toDate = moment().add(5, 'days');

    this.jupiterHotelBookRQ = new JupiterHotelBookRQ({
      ConnectorsEnvironment: [],
      Request: new JupiterHotelBookInput({
        ConnectorsDebug: [],
        ConnectorCode: null,
        ConnectorCustomData: null,
        FromDate: fromDate.format('YYYY-MM-DD'),
        ToDate: toDate.format('YYYY-MM-DD'),
        HotelId: '',
        CustomerBookReference: '',
        Notes: '',
        CreditCardPayment: null,
        ExtrasToBook: [],
        RoomsToBook: [],
        TravelCompany: null,
      })
    });


    // Extras
    let extraToBook = new ExtraToBook({});
    this.jupiterHotelBookRQ.Request.ExtrasToBook = [extraToBook];



    this.addRoom();
    this.addPax(this.jupiterHotelBookRQ.Request.RoomsToBook[0]);

    // Additional Properties
    this.jupiterHotelBookRQ.Request['_MinDate'] = moment();
    this.jupiterHotelBookRQ.Request['_DateRange'] = {
      start: fromDate,
      end: toDate
    };

    this.jupiterHotelBookRS = null;
  }

  /**
   * Format From and To Dates
   * @param $event
   */
  handleRangeChange($event) {
    if ($event.start) {
      this.jupiterHotelBookRQ.Request.FromDate = moment($event.start).format('YYYY-MM-DD');
    }
    if ($event.end) {
      this.jupiterHotelBookRQ.Request.ToDate = moment($event.end).format('YYYY-MM-DD');
    }
  }

  /**
   * Callback Changed the main Connector -> Add Custom data
   * @param connector
   */
  handleConnectorsChanged(connector: EH2HConnectorCode) {
    switch (connector) {
      case EH2HConnectorCode.SABRE_SYNXIS:
        this.jupiterHotelBookRQ.Request.ConnectorCustomData = new SabreSynXisHotelBookInputCustomData({
          ChannelSubSourceCode: '',
          ArrivalBy: new TransportInfo({
            IsFlight: false,
            LocationCode: '',
            TransportId: '',
            Time: ''
          }),
          DepartureBy: new TransportInfo({
            IsFlight: false,
            LocationCode: '',
            TransportId: '',
            Time: ''
          }),
          SabreBookStatus: ESabreBookStatus.INITIATE,
          SabreBookingReference: new SabreBookingReference({
            Id: '',
            InfoType: '',
            Type: ''
          }),
          SendConfirmationEmailTemplate: ''
        });
        break;
      case EH2HConnectorCode.IHG_GRS:
        this.jupiterHotelBookRQ.Request.ConnectorCustomData = new IHGHotelBookInputCustomData({
          IhgAgentToken: '',
          IhgImpersonatorId: '',
          IhgPos: '',
          IhgSessionId: '',
          IhgSsoToken: '',
          IhgLanguage: '',
          AcceptCurrency: '',
          ArrivalTransport: new Transportation({
            Id: '',
            LocationCode: '',
            LocationDescription: '',
            RemoteLocation: '',
            Terminal: '',
            Time: '',
            Type: 0
          }),
          DepartureTransport: new Transportation({
            Id: '',
            LocationCode: '',
            LocationDescription: '',
            RemoteLocation: '',
            Terminal: '',
            Time: '',
            Type: 0
          }),
          CommunicationEmails: [],
          CommunicationSmsNumbers: [],
          LoyaltyId: '',
        });
        break;
    }
  }

  /**
   * Add Credit Card Info
   */
  addCreditCard() {
    // Credit Card Info
    let creditCardPayment = new CreditCardInfo({
      CreditCardType: ECreditCardType.VISA,
      CardHolderFirstName: '',
      CardHolderLastName: '',
      CardHolderName: '',
      CreditCardNumber: '',
      CreditCardCvv: '',
      StartDate: '',
      ExpireDate: '',
      IssueNumber: '',
    });
    creditCardPayment['_DataInputSettings'] = new DataInputSettings({
      dateProps: ['StartDate', 'ExpireDate'],
      numProps: ['CreditCardNumber', 'CreditCardCvv'],
      tagProps: [],
      enumProps: ['CreditCardType'],
      boolProps: [],
      objProps: [],
      objArrayProps: [],
      omitProps: [],
      enums: {'CreditCardType': Object.keys(ECreditCardType)}
    });
    this.jupiterHotelBookRQ.Request.CreditCardPayment = creditCardPayment;
  }

  /**
   * Delete Credit Card
   */
  deleteCreditCard() {
    this.jupiterHotelBookRQ.Request.CreditCardPayment = null;
  }

  /**
   * Add TravelCompany
   */
  addTravelCompany() {
    // Travel Company
    let travelCompany = new TravelCompany({
      Name: '',
      VatNumber: '',
      Addresses: [
        new Address({
          City: '',
          Country: '',
          State: '',
          Street: '',
          Type: '',
          Zip: ''
        })
      ],
      Emails: [new Email({
        Title: '',
        Value: ''
      })],
      PhoneNumbers: [new Phone({
        Title: '',
        Value: ''
      })]
    });
    travelCompany['_DataInputSettings'] = new DataInputSettings({
      dateProps: [],
      numProps: [],
      tagProps: [],
      enumProps: ['CreditCardType'],
      boolProps: [],
      objProps: [],
      objArrayProps: ['Addresses', 'Emails', 'PhoneNumbers'],
      omitProps: [],
      enums: {}
    });
    this.jupiterHotelBookRQ.Request.TravelCompany = travelCompany;
  }

  addAddress(propertyName: string, obj: any) {
    let address = new Address({
      City: '',
      Country: '',
      State: '',
      Street: '',
      Type: '',
      Zip: ''
    });
    obj[propertyName].push(address);
  }

  addPhone(propertyName: string, obj: any){

  }

  addEmail(propertyName: string, obj: any){

  }

  /**
   * Delete TravelCompany
   */
  deleteTravelCompany() {
    this.jupiterHotelBookRQ.Request.TravelCompany = null;
  }

  /**
   * Add a room
   */
  addRoom() {
    let room = new RoomToBook({
      ConnectorCustomData: null,
      ExtrasToBook: [],
      Paxes: []
    });
    room['_DataInputSettings'] = new DataInputSettings({
      dateProps: [],
      numProps: [],
      tagProps: [],
      enumProps: [],
      boolProps: [],
      objProps: [],
      objArrayProps: [],
      omitProps: ['Paxes', 'ExtrasToBook'],
      enums: {}
    });
    // Additional Properties
    room['_ConnectorCustomDataConnectorCode'] = null;

    this.jupiterHotelBookRQ.Request.RoomsToBook.push(room);
  }

  /**
   * Remove a room
   * @param index
   */
  removeRoom(index: number) {
    this.jupiterHotelBookRQ.Request.RoomsToBook.splice(index, 1);
  }

  /**
   * Add a Pax to the room
   * @param room
   */
  addPax(room: RoomToBook) {
    let pax = new PaxBook({
      IsLeader: true,
      Gender: EPaxGender.MALE,
      PaxTitle: '',
      FirstName: '',
      MiddleName: '',
      LastName: '',
      ProfileId: null,
      BirthDate: '',
      Address: new Address({
        City: '',
        Country: '',
        State: '',
        Street: '',
        Type: '',
        Zip: ''
      }),
      Company: new BusinessCompany({
        Name: '',
        VatNumber: '',
        PhoneNumbers: [],
        Emails: [],
        Addresses: []
      }),
      Documents: [
        new PaxDocument({
          Type: EDocumentType.PASSPORT,
          FirstName: '',
          LastName: '',
          Number: '',
          ExpirationDate: '',
          IssueIsoCode: '',
        })
      ],
      LoyaltyCards: [
        new PaxLoyaltyCard({
          CardExpirationDate: '',
          IataCode: '',
          MembershipId: '',
          ProgramId: '',
        })
      ],
      Emails: [
        new Email({
          Title: '',
          Value: ''
        })
      ],
      PhoneNumbers: [
        new Phone({
          Title: '',
          Value: ''
        })
      ]
    });
    pax['_DataInputSettings'] = new DataInputSettings({
      dateProps: ['BirthDate'],
      numProps: [],
      tagProps: [],
      enumProps: ['Gender'],
      boolProps: ['IsLeader'],
      objProps: ['Company'],
      objArrayProps: ['Address', 'Documents', 'LoyaltyCards', 'Emails', 'PhoneNumbers'],
      omitProps: ['Paxes', 'ExtrasToBook'],
      enums: {'Gender': Object.keys(EPaxGender)}
    });
    room.Paxes.push(pax);
  }

  /**
   * Remove the pax from the room
   * @param room
   * @param index
   */
  removePax(room: RoomToBook, index: number) {
    room.Paxes.splice(index, 1);
  }


  /**
   * Delete custom data
   */
  deleteCustomData() {
    this.jupiterHotelBookRQ.Request.ConnectorCustomData = null;
  }

  doBook() {
    this.loading = true;

    this.jupiterApiService.hotelBook(this.jupiterHotelBookRQ).subscribe(response => {
      this.jupiterHotelBookRS = response;
      this.accordionItemRq.close();
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'hotelBookDetails Error',
          error: error
        },
      });
    });
  }
  roomConnectorCustomDataConnectorCodeChanged(event: any, roomToBookCustom: RoomToBook){
    //TODO; Need to be implemented
  }
}
